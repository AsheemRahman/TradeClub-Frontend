'use client';

import { useState, useEffect, useMemo } from 'react';
import { Search, Filter, Grid, List, ChevronDown } from 'lucide-react';
import { CourseListItem } from '@/components/user/CourseListItem';
import { CourseCard } from '@/components/user/CourseCard';
import { ICategory, ICourse } from '@/types/courseTypes';
import { categoryData, courseData } from '@/app/service/user/userApi';



const CoursesPage = () => {
    const [courses, setCourses] = useState<ICourse[]>([]);
    const [categories, setCategories] = useState<ICategory[]>([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    // Filter states
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
    const [sortBy, setSortBy] = useState('newest');
    const [showFilters, setShowFilters] = useState(false);

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const coursesPerPage = 4;

    useEffect(() => {
    const fetchData = async () => {
        setLoading(true);
        try {
            const [coursesRes, categoriesRes] = await Promise.all([courseData(), categoryData()]);
            if (!coursesRes.status || !categoriesRes.status) {
                throw new Error('Failed to fetch data');
            }
            setCourses(coursesRes.courses || []);
            setCategories(categoriesRes.categories || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };
    fetchData();
}, []);

    // Filtered and sorted courses
    const filteredCourses = useMemo(() => {
        const filtered = courses.filter(course => {
            const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) || course.description.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = selectedCategory === '' || course.category === selectedCategory;
            const matchesPrice = course.price >= priceRange[0] && course.price <= priceRange[1];
            return matchesSearch && matchesCategory && matchesPrice;
        });
        // Sort courses
        switch (sortBy) {
            case 'price-low':
                filtered.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                filtered.sort((a, b) => b.price - a.price);
                break;
            default:
                filtered.sort((a, b) => {
                    const dateA = new Date(a.createdAt ?? 0).getTime();
                    const dateB = new Date(b.createdAt ?? 0).getTime();
                    return dateB - dateA;
                });
                break;
        }
        return filtered;
    }, [courses, searchTerm, selectedCategory, priceRange, sortBy]);

    // Pagination
    const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);
    const paginatedCourses = filteredCourses.slice(
        (currentPage - 1) * coursesPerPage,
        currentPage * coursesPerPage
    );

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading courses...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen ">
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white mb-4">All Courses</h1>
                    <p className="text-gray-400">Discover and learn from our comprehensive course collection</p>
                </div>

                {/* Search and Filters */}
                <div className="bg-[#151231] rounded-lg shadow-sm p-6 mb-8">
                    {/* Search Bar */}
                    <div className="relative mb-4">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-200 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search courses..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border text-white border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    {/* Filter Toggle for Mobile */}
                    <div className="flex justify-between items-center mb-4">
                        <button onClick={() => setShowFilters(!showFilters)} className="md:hidden flex items-center text-blue-600">
                            <Filter className="w-4 h-4 mr-2" />
                            Filters
                            <ChevronDown className={`w-4 h-4 ml-1 transform transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                        </button>

                        {/* View Mode Toggle */}
                        <div className="flex items-center space-x-2">
                            <button onClick={() => setViewMode('grid')} className={`p-2 rounded ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                                <Grid className="w-4 h-4" />
                            </button>
                            <button onClick={() => setViewMode('list')}
                                className={`p-2 rounded ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}
                            >
                                <List className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className={`grid grid-cols-1 md:grid-cols-4 gap-4 ${showFilters ? 'block' : 'hidden md:grid'}`}>
                        {/* Category Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                            <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}
                                className="w-full px-3 py-2 text-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="" className='text-black'>All Categories</option>
                                {categories.map(category => (
                                    <option key={category._id} value={category._id} className='text-black'>
                                        {category.categoryName}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Price Range */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Price Range: ${priceRange[0]} - ${priceRange[1]}
                            </label>
                            <div className="flex space-x-2">
                                <input type="range" min="0" max="10000" value={priceRange[0]} className="flex-1"
                                    onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                                />
                                <input type="range" min="0" max="5000" value={priceRange[1]} className="flex-1"
                                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                                />
                            </div>
                        </div>

                        {/* Sort By */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Sort By</label>
                            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
                                className="w-full px-3 py-2 text-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="newest" className='text-black'>Newest</option>
                                <option value="price-low" className='text-black'>Price: Low to High</option>
                                <option value="price-high" className='text-black'>Price: High to Low</option>
                                <option value="rating" className='text-black'>Highest Rated</option>
                                <option value="popular" className='text-black'>Most Popular</option>
                            </select>
                        </div>

                        {/* Clear Filters */}
                        <div className="flex items-end">
                            <button onClick={() => { setSearchTerm(''); setSelectedCategory(''); setPriceRange([0, 10000]); setSortBy('newest'); setCurrentPage(1); }}
                                className="w-full px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                            >
                                Clear Filters
                            </button>
                        </div>
                    </div>
                </div>

                {/* Results Count */}
                <div className="flex justify-between items-center mb-6">
                    <p className="text-gray-200">
                        Showing {paginatedCourses.length} of {filteredCourses.length} courses
                    </p>
                </div>

                {/* Course Grid/List */}
                {filteredCourses.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">No courses found matching your criteria.</p>
                        <p className="text-gray-400 mt-2">Try adjusting your filters or search terms.</p>
                    </div>
                ) : (
                    <div className={viewMode === 'grid'
                        ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8"
                        : "space-y-4 mb-8"
                    }>
                        {paginatedCourses.map(course => (
                            viewMode === 'grid'
                                ? <CourseCard key={course._id} course={course} />
                                : <CourseListItem key={course._id} course={course} />
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex justify-center items-center space-x-2">
                        <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1}
                            className="px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Previous
                        </button>

                        {[...Array(totalPages)].map((_, i) => (
                            <button key={i} onClick={() => setCurrentPage(i + 1)}
                                className={`px-4 py-2 rounded-lg ${currentPage === i + 1
                                    ? 'bg-blue-600 text-white'
                                    : 'text-blue-600 border border-blue-600 hover:bg-blue-50'
                                    }`}
                            >
                                {i + 1}
                            </button>
                        ))}

                        <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}
                            className="px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CoursesPage;