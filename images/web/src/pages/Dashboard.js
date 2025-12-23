import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { savedItemsAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import DashboardHeader from '../components/DashboardHeader';
import EmptyState from '../components/EmptyState';
import ItemsTable from '../components/ItemsTable';
import BulkActions from '../components/BulkActions';

const Dashboard = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [searchResultInfo, setSearchResultInfo] = useState(null);
  const [expandedRows, setExpandedRows] = useState(new Set());
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [bulkActionLoading, setBulkActionLoading] = useState(false);

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchItems();
  }, []);

  useEffect(() => {
    fetchFilteredItems();
  }, [searchQuery]);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const response = await savedItemsAPI.getAll();
      setItems(response.data.items);
      setError('');
    } catch (err) {
      setError('Failed to load saved items');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    if (searchQuery) {
      fetchFilteredItems();
    } else {
      fetchItems();
    }
  };

  const fetchFilteredItems = async () => {
    try {
      setLoading(true);
      let response;
      if (!searchQuery) {
        response = await savedItemsAPI.getAll();
        setIsSearchMode(false);
        setSearchResultInfo(null);
      } else {
        response = await savedItemsAPI.search(searchQuery);
        setIsSearchMode(true);
        setSearchResultInfo({
          query: response.data.query,
          count: response.data.count
        });
      }

      setItems(response.data.items);
      setError('');
    } catch (err) {
      setError('Failed to load saved items');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) {
      return;
    }

    try {
      setDeleteLoading(id);
      await savedItemsAPI.delete(id);
      setItems(items.filter(item => item.id !== id));
    } catch (err) {
      alert('Failed to delete item');
      console.error(err);
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const goToProfile = () => {
    navigate('/profile');
  };

  const handleSearch = (query) => {
    if (query.trim() === '') {
      setSearchQuery('');
      return;
    }

    // If there's already a search query, stack the new keywords
    if (searchQuery.trim()) {
      // Combine existing and new search terms
      const existingTerms = searchQuery.trim().toLowerCase().split(/\s+/).filter(term => term.length > 0);
      const newTerms = query.trim().toLowerCase().split(/\s+/).filter(term => term.length > 0);
      
      // Combine arrays and remove duplicates while preserving order
      const combinedTerms = [...new Set([...existingTerms, ...newTerms])];
      setSearchQuery(combinedTerms.join(' '));
    } else {
      setSearchQuery(query.trim());
    }
  };

  const clearSearchFilter = () => {
    setSearchQuery('');
  };

  const toggleRowExpansion = (itemId) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId);
    } else {
      newExpanded.add(itemId);
    }
    setExpandedRows(newExpanded);
  };

  const handleSelectItem = (itemId) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(itemId)) {
      newSelected.delete(itemId);
    } else {
      newSelected.add(itemId);
    }
    setSelectedItems(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedItems.size === items.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(items.map(item => item.id)));
    }
  };

  const handleBulkDelete = async () => {
    if (selectedItems.size === 0) {
      alert('No items selected');
      return;
    }

    if (!window.confirm(`Delete ${selectedItems.size} selected items?`)) {
      return;
    }

    try {
      setBulkActionLoading(true);
      await savedItemsAPI.bulkDelete(Array.from(selectedItems));

      // Remove deleted items from state
      setItems(items.filter(item => !selectedItems.has(item.id)));
      setSelectedItems(new Set());
    } catch (err) {
      alert('Failed to delete items');
      console.error(err);
    } finally {
      setBulkActionLoading(false);
    }
  };

  const handleBulkMarkAsRead = async () => {
    if (selectedItems.size === 0) {
      alert('No items selected');
      return;
    }

    try {
      setBulkActionLoading(true);
      await savedItemsAPI.bulkMarkAsRead(Array.from(selectedItems));

      // Update items in state
      setItems(items.map(item =>
        selectedItems.has(item.id)
          ? { ...item, is_read: true }
          : item
      ));
      setSelectedItems(new Set());
    } catch (err) {
      alert('Failed to mark items as read');
      console.error(err);
    } finally {
      setBulkActionLoading(false);
    }
  };

  const handleBulkMarkAsUnread = async () => {
    if (selectedItems.size === 0) {
      alert('No items selected');
      return;
    }

    try {
      setBulkActionLoading(true);
      await savedItemsAPI.bulkMarkAsUnread(Array.from(selectedItems));

      // Update items in state
      setItems(items.map(item =>
        selectedItems.has(item.id)
          ? { ...item, is_read: false }
          : item
      ));
      setSelectedItems(new Set());
    } catch (err) {
      alert('Failed to mark items as unread');
      console.error(err);
    } finally {
      setBulkActionLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading your saved items...</div>;
  }

  return (
    <div className="dashboard">
      <DashboardHeader
        username={user?.username}
        onProfile={goToProfile}
        onLogout={handleLogout}
      />

      {error && <div className="error-message">{error}</div>}

      {items.length === 0 ? (
        <EmptyState isSearchMode={isSearchMode} />
      ) : (
        <>
          <BulkActions
            itemsCount={items.length}
            selectedCount={selectedItems.size}
            allSelected={selectedItems.size === items.length}
            bulkActionLoading={bulkActionLoading}
            onSelectAll={handleSelectAll}
            onMarkAsRead={handleBulkMarkAsRead}
            onMarkAsUnread={handleBulkMarkAsUnread}
            onDelete={handleBulkDelete}
            onRefresh={handleRefresh}
            onSearch={handleSearch}
            searchPlaceholder="Search in titles, highlights, and descriptions..."
          />

          <ItemsTable
            items={items}
            expandedRows={expandedRows}
            selectedItems={selectedItems}
            onToggleRow={toggleRowExpansion}
            onDelete={handleDelete}
            onSelectItem={handleSelectItem}
            onSelectAll={handleSelectAll}
            deleteLoading={deleteLoading}
            searchQuery={searchQuery}
          />
        </>
      )}
    </div>
  );
};

export default Dashboard;
