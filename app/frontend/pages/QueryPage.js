import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

const QueryPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [query, setQuery] = useState(null);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);

  // Fetch query details
  useEffect(() => {
    const fetchQuery = async () => {
      try {
        const response = await api.getQuery(id);
        setQuery(response.data.query);
      } catch (err) {
        setError('Failed to load query details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuery();
  }, [id]);

  // Handle comment submission
  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    setCommentLoading(true);
    try {
      const response = await api.addComment(id, comment);
      setQuery(response.data.query);
      setComment('');
    } catch (err) {
      setError('Failed to add comment');
      console.error(err);
    } finally {
      setCommentLoading(false);
    }
  };

  // Handle status update
  const handleStatusUpdate = async (newStatus) => {
    try {
      const response = await api.updateQuery(id, { status: newStatus });
      setQuery(response.data.query);
    } catch (err) {
      setError('Failed to update status');
      console.error(err);
    }
  };

  // Handle delete query
  const handleDeleteQuery = async () => {
    if (!window.confirm('Are you sure you want to delete this query?')) {
      return;
    }

    try {
      await api.deleteQuery(id);
      navigate('/queries'); // Redirect after successful deletion
    } catch (err) {
      setError('Failed to delete query');
      console.error(err);
    }
  };

  if (loading) {
    return <div className="loading">Loading query details...</div>;
  }

  if (error) {
    return <div className="error-alert">{error}</div>;
  }

  if (!query) {
    return <div className="not-found">Query not found</div>;
  }

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isAdmin = user.role === 'admin';
  const isOwner = query.user._id === user._id;
  const canModify = isAdmin || isOwner;

  return (
    <div className="query-page">
      <div className="query-header">
        <h1>{query.title}</h1>
        <div className="query-meta">
          <span className={`status status-${query.status}`}>{query.status}</span>
          <span className="priority priority-{query.priority}">{query.priority}</span>
          <span className="category">{query.category}</span>
        </div>
      </div>
      
      <div className="query-details">
        <div className="query-info">
          <div className="info-item">
            <span className="label">Submitted by:</span>
            <span className="value">{query.user.name}</span>
          </div>
          <div className="info-item">
            <span className="label">Created:</span>
            <span className="value">{new Date(query.createdAt).toLocaleString()}</span>
          </div>
          {query.assignedTo && (
            <div className="info-item">
              <span className="label">Assigned to:</span>
              <span className="value">{query.assignedTo.name}</span>
            </div>
          )}
          {query.resolvedAt && (
            <div className="info-item">
              <span className="label">Resolved:</span>
              <span className="value">{new Date(query.resolvedAt).toLocaleString()}</span>
            </div>
          )}
        </div>
        
        <div className="description">
          <h3>Description</h3>
          <p>{query.description}</p>
        </div>
        
        {canModify && (
          <div className="actions">
            <div className="status-actions">
              <h3>Update Status</h3>
              <div className="button-group">
                <button 
                  onClick={() => handleStatusUpdate('pending')}
                  className={`btn ${query.status === 'pending' ? 'btn-active' : ''}`}
                  disabled={query.status === 'pending'}
                >
                  Pending
                </button>
                <button 
                  onClick={() => handleStatusUpdate('in-progress')}
                  className={`btn ${query.status === 'in-progress' ? 'btn-active' : ''}`}
                  disabled={query.status === 'in-progress'}
                >
                  In Progress
                </button>
                <button 
                  onClick={() => handleStatusUpdate('resolved')}
                  className={`btn ${query.status === 'resolved' ? 'btn-active' : ''}`}
                  disabled={query.status === 'resolved'}
                >
                  Resolved
                </button>
                <button 
                  onClick={() => handleStatusUpdate('closed')}
                  className={`btn ${query.status === 'closed' ? 'btn-active' : ''}`}
                  disabled={query.status === 'closed'}
                >
                  Closed
                </button>
              </div>
            </div>
            
            {(isAdmin || isOwner) && (
              <button onClick={handleDeleteQuery} className="btn btn-danger">
                Delete Query
              </button>
            )}
          </div>
        )}
      </div>
      
      <div className="comments-section">
        <h3>Comments ({query.comments?.length || 0})</h3>
        
        <form onSubmit={handleAddComment} className="comment-form">
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Add a comment..."
            disabled={commentLoading}
            required
          />
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={commentLoading}
          >
            {commentLoading ? 'Posting...' : 'Post Comment'}
          </button>
        </form>
        
        <div className="comments-list">
          {query.comments && query.comments.length > 0 ? (
            query.comments.map((comment, index) => (
              <div key={index} className="comment">
                <div className="comment-header">
                  <span className="comment-author">{comment.user.name}</span>
                  <span className="comment-date">
                    {new Date(comment.createdAt).toLocaleString()}
                  </span>
                </div>
                <div className="comment-body">{comment.text}</div>
              </div>
            ))
          ) : (
            <p className="no-comments">No comments yet</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default QueryPage;
