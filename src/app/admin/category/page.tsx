"use client"

import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, Filter, CheckCircle, XCircle } from 'lucide-react';

import { addCategory, deleteCategory, editCategory, getCategory } from '@/app/service/admin/courseApi';
import { toast } from 'react-toastify';
import { ICategory } from '@/types/courseTypes';

export default function CategoryManagement() {
    const [categories, setCategories] = useState<ICategory[]>([]);
    const [filteredCategories, setFilteredCategories] = useState<ICategory[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<ICategory | null>(null);
    const [formData, setFormData] = useState({ _id: '', categoryName: '', isActive: true });

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        let filtered = categories;
        if (searchTerm) {
            filtered = filtered.filter(cat => cat.categoryName.toLowerCase().includes(searchTerm.toLowerCase()));
        }
        if (filterStatus !== 'all') {
            filtered = filtered.filter(cat => filterStatus === 'active' ? cat.isActive : !cat.isActive);
        }
        setFilteredCategories(filtered);
    }, [categories, searchTerm, filterStatus]);

    const fetchCategories = async () => {
        const response = await getCategory();
        if (response?.status) {
            setCategories(response.categories);
        } else {
            toast.error("Failed to fetch categories");
        }
    };

    const handleAddCategory = async () => {
        if (!formData.categoryName.trim() || formData.categoryName.length < 5) {
            toast.error("Charactor must be more than 4")
            return;
        }
        try {
            const response = await addCategory(formData.categoryName.trim());
            if (response?.status) {
                const newCategory = {
                    _id: response?.newCategory?._id,
                    categoryName: response.newCategory.categoryName,
                    isActive: response.newCategory.isActive,
                    createdAt: new Date(response.newCategory.createdAt || new Date()),
                    updatedAt: new Date(response.newCategory.updatedAt || new Date())
                };
                setCategories(prev => [...prev, newCategory]);
                setFormData({ _id: '', categoryName: '', isActive: true });
                setShowAddModal(false);
            }
        } catch (error) {
            console.error('Error adding category:', error);
        }
    };

    const handleEditCategory = async () => {
        if (!formData.categoryName.trim() || formData.categoryName.length < 5) {
            toast.error("Charactor must be more than 4")
            return;
        }
        try {
            const response = await editCategory(formData._id, formData.categoryName.trim());
            if (response?.status) {
                const newCategory = {
                    _id: response?.newCategory?._id,
                    categoryName: response.newCategory.categoryName,
                    isActive: response.newCategory.isActive,
                    createdAt: new Date(response.newCategory.createdAt || new Date()),
                    updatedAt: new Date(response.newCategory.updatedAt || new Date())
                };
                setCategories(prev => [...prev, newCategory]);
                toast.success("Category edited successfully");
                setFormData({ _id: '', categoryName: '', isActive: true });
                setShowAddModal(false);
            }
        } catch (error) {
            console.error('Error editing category:', error);
        } finally {
            setShowEditModal(false);
            setSelectedCategory(null);
            setFormData({ _id: '', categoryName: '', isActive: true });
        }
    };

    const handleDeleteCategory = async () => {
        if (!selectedCategory) {
            toast.error("Category is missing")
            return
        };
        try {
            const response = await deleteCategory(selectedCategory._id);
            if (response?.status) {
                const updatedCategories = categories.filter(cat => cat._id !== selectedCategory._id);
                setCategories(updatedCategories);
                toast.success("Category deleted successfully");
            }
        } catch (error) {
            console.error("Error deleting category:", error);
            toast.error("An error occurred while deleting the category");
        } finally {
            setShowDeleteModal(false);
            setSelectedCategory(null);
        }
    };

    const openEditModal = (category: ICategory) => {
        setSelectedCategory(category);
        setFormData({ _id: category._id, categoryName: category.categoryName, isActive: category.isActive });
        setShowEditModal(true);
    };

    const openDeleteModal = (category: ICategory) => {
        setSelectedCategory(category);
        setShowDeleteModal(true);
    };

    const toggleCategoryStatus = (categoryId: string) => {
        const updatedCategories = categories.map(cat => cat._id === categoryId ? { ...cat, isActive: !cat.isActive, updatedAt: new Date() } : cat);
        setCategories(updatedCategories);
    };

    const formatDate = (date: Date | undefined) => {
        if (!date) return 'Invalid Date';
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <div className="min-h-screen bg-[#151231] rounded-xl p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h1 className="text-3xl font-bold text-white">Category Management</h1>
                            <p className="text-gray-600 mt-1">Manage your product categories</p>
                        </div>
                        <button onClick={() => setShowAddModal(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors shadow-sm">
                            <Plus size={20} />
                            Add Category
                        </button>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        <div className="bg-white rounded-xl p-6 shadow-sm border">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-600 text-sm">Total Categories</p>
                                    <p className="text-3xl font-bold text-gray-900">{categories.length}</p>
                                </div>
                                <div className="bg-blue-100 p-3 rounded-full">
                                    <Filter className="text-blue-600" size={24} />
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-xl p-6 shadow-sm border">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-600 text-sm">Active Categories</p>
                                    <p className="text-3xl font-bold text-green-600">{categories.filter(c => c.isActive).length}</p>
                                </div>
                                <div className="bg-green-100 p-3 rounded-full">
                                    <CheckCircle className="text-green-600" size={24} />
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-xl p-6 shadow-sm border">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-600 text-sm">Inactive Categories</p>
                                    <p className="text-3xl font-bold text-red-600">{categories.filter(c => !c.isActive).length}</p>
                                </div>
                                <div className="bg-red-100 p-3 rounded-full">
                                    <XCircle className="text-red-600" size={24} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Search and Filter */}
                    <div className="flex flex-col sm:flex-row gap-4 mb-6">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <input type="text" placeholder="Search categories..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 text-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
                            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 text-white focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="all" className='text-black'>All Status</option>
                            <option value="active" className='text-black'>Active Only</option>
                            <option value="inactive" className='text-black'>Inactive Only</option>
                        </select>
                    </div>
                </div>

                {/* Categories Table */}
                <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b">
                                <tr>
                                    <th className="text-left py-4 px-6 font-semibold text-gray-900">Category Name</th>
                                    <th className="text-left py-4 px-6 font-semibold text-gray-900">Created</th>
                                    <th className="text-left py-4 px-6 font-semibold text-gray-900">Updated</th>
                                    <th className="text-left py-4 px-6 font-semibold text-gray-900">Status</th>
                                    <th className="text-center py-4 px-6 font-semibold text-gray-900">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {filteredCategories.map((category) => (
                                    <tr key={category._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="py-4 px-6">
                                            <div className="font-medium text-gray-900">{category.categoryName}</div>
                                        </td>
                                        <td className="py-4 px-6 text-gray-600">{formatDate(category.createdAt)}</td>
                                        <td className="py-4 px-6 text-gray-600">{formatDate(category.updatedAt)}</td>
                                        <td className="py-4 px-6">
                                            <button onClick={() => toggleCategoryStatus(category._id)}
                                                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium transition-colors ${category.isActive
                                                    ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                                    : 'bg-red-100 text-red-800 hover:bg-red-200'}`}
                                            >
                                                {category.isActive ? (
                                                    <>
                                                        <CheckCircle size={14} className="mr-1" />
                                                        Active
                                                    </>
                                                ) : (
                                                    <>
                                                        <XCircle size={14} className="mr-1" />
                                                        Inactive
                                                    </>
                                                )}
                                            </button>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex items-center justify-center gap-2">
                                                <button onClick={() => openEditModal(category)} className="text-blue-600 hover:text-blue-800 p-2 hover:bg-blue-50 rounded-lg transition-colors">
                                                    <Edit2 size={16} />
                                                </button>
                                                <button onClick={() => openDeleteModal(category)} className="text-red-600 hover:text-red-800 p-2 hover:bg-red-50 rounded-lg transition-colors">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {filteredCategories.length === 0 && (
                        <div className="text-center py-12">
                            <div className="text-gray-400 mb-4">
                                <Filter size={48} className="mx-auto" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No categories found</h3>
                            <p className="text-gray-600 mb-4"> {searchTerm || filterStatus !== 'all' ? 'Try adjusting your search or filter criteria.' : 'Get started by adding your first category.'}
                            </p>
                            {!searchTerm && filterStatus === 'all' && (
                                <button onClick={() => setShowAddModal(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors">
                                    Add Your First Category
                                </button>
                            )}
                        </div>
                    )}
                </div>

                {/* Add Category Modal */}
                {showAddModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-xl max-w-md w-full p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Add New Category</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Category Name</label>
                                    <input type="text" placeholder="Enter category name" value={formData.categoryName} onChange={(e) => setFormData({ ...formData, categoryName: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                            </div>
                            <div className="flex gap-3 mt-6">
                                <button onClick={() => setShowAddModal(false)} className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                                    Cancel
                                </button>
                                <button onClick={handleAddCategory} className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                                    Add Category
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Edit Category Modal */}
                {showEditModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-xl max-w-md w-full p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Edit Category</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Category Name</label>
                                    <input type="text" value={formData.categoryName} onChange={(e) => setFormData({ ...formData, categoryName: e.target.value })} placeholder="Enter category name"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                                <div className="flex items-center">
                                    <input type="checkbox" id="isActiveEdit" checked={formData.isActive} onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                    />
                                    <label htmlFor="isActiveEdit" className="ml-2 text-sm text-gray-700">Active</label>
                                </div>
                            </div>
                            <div className="flex gap-3 mt-6">
                                <button onClick={() => { setShowEditModal(false); setSelectedCategory(null); setFormData({ _id: '', categoryName: '', isActive: true }); }}
                                    className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button onClick={handleEditCategory} className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                                    Update Category
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Delete Confirmation Modal */}
                {showDeleteModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-xl max-w-md w-full p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Delete Category</h2>
                            <p className="text-gray-600 mb-6">
                                Are you sure you want to delete &quot;{selectedCategory?.categoryName}&quot;? This action cannot be undone.
                            </p>
                            <div className="flex gap-3">
                                <button onClick={() => { setShowDeleteModal(false); setSelectedCategory(null); }} className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                                    Cancel
                                </button>
                                <button onClick={handleDeleteCategory} className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors">
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}