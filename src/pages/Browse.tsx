import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, SlidersHorizontal, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ContentCard } from '@/components/content/ContentCard';
import { departments, semesters, contentItems } from '@/data/mockData';
import { ContentType } from '@/types';
import { cn } from '@/lib/utils';

type SortOption = 'newest' | 'popular' | 'price-low' | 'price-high' | 'alphabetical';

export function Browse() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');

  // Filter states from URL params
  const selectedDepartment = searchParams.get('department') || 'all';
  const selectedSemester = searchParams.get('semester') || 'all';
  const selectedType = (searchParams.get('type') as ContentType | 'all') || 'all';
  const sortBy = (searchParams.get('sort') as SortOption) || 'popular';

  const updateFilter = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value === 'all' || !value) {
      newParams.delete(key);
    } else {
      newParams.set(key, value);
    }
    setSearchParams(newParams);
  };

  const clearFilters = () => {
    setSearchParams({});
    setSearchQuery('');
  };

  // Filter and sort content
  const filteredContent = useMemo(() => {
    let filtered = contentItems.filter(item => {
      const matchesDepartment = selectedDepartment === 'all' || item.departmentId === selectedDepartment;
      const matchesSemester = selectedSemester === 'all' || item.semesterId === selectedSemester;
      const matchesType = selectedType === 'all' || item.type === selectedType;
      const matchesSearch = !searchQuery || 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      return matchesDepartment && matchesSemester && matchesType && matchesSearch;
    });

    // Sort
    switch (sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'popular':
        filtered.sort((a, b) => b.reviewCount - a.reviewCount);
        break;
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'alphabetical':
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
    }

    return filtered;
  }, [selectedDepartment, selectedSemester, selectedType, sortBy, searchQuery]);

  const hasActiveFilters = selectedDepartment !== 'all' || selectedSemester !== 'all' || selectedType !== 'all' || searchQuery;

  const contentTypes: { value: ContentType | 'all'; label: string }[] = [
    { value: 'all', label: 'All Types' },
    { value: 'notes', label: 'Notes' },
    { value: 'microproject', label: 'Microprojects' },
    { value: 'capstone', label: 'Capstone' },
  ];

  const sortOptions: { value: SortOption; label: string }[] = [
    { value: 'popular', label: 'Most Popular' },
    { value: 'newest', label: 'Newest First' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'alphabetical', label: 'A to Z' },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card sticky top-16 z-30">
        <div className="container mx-auto px-4 py-4">
          {/* Search Bar */}
          <div className="relative mb-4">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search notes, projects, topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-secondary rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0 no-scrollbar">
            {/* Type Filter Pills */}
            {contentTypes.map((type) => (
              <button
                key={type.value}
                onClick={() => updateFilter('type', type.value)}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors",
                  selectedType === type.value
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                )}
              >
                {type.label}
              </button>
            ))}

            <div className="h-6 w-px bg-border mx-1" />

            {/* More Filters Button */}
            <Button
              variant="outline"
              size="sm"
              className="gap-2 whitespace-nowrap"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filters
              {hasActiveFilters && (
                <span className="w-2 h-2 rounded-full bg-primary" />
              )}
            </Button>
          </div>

          {/* Expanded Filters */}
          {isFilterOpen && (
            <div className="mt-4 p-4 bg-secondary/50 rounded-xl space-y-4 animate-fade-in">
              {/* Department */}
              <div>
                <label className="text-sm font-medium mb-2 block">Department</label>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => updateFilter('department', 'all')}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-sm transition-colors",
                      selectedDepartment === 'all' ? "bg-primary text-primary-foreground" : "bg-card hover:bg-card/80"
                    )}
                  >
                    All
                  </button>
                  {departments.map((dept) => (
                    <button
                      key={dept.id}
                      onClick={() => updateFilter('department', dept.id)}
                      className={cn(
                        "px-3 py-1.5 rounded-lg text-sm transition-colors",
                        selectedDepartment === dept.id ? "bg-primary text-primary-foreground" : "bg-card hover:bg-card/80"
                      )}
                    >
                      {dept.code}
                    </button>
                  ))}
                </div>
              </div>

              {/* Semester */}
              <div>
                <label className="text-sm font-medium mb-2 block">Semester</label>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => updateFilter('semester', 'all')}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-sm transition-colors",
                      selectedSemester === 'all' ? "bg-primary text-primary-foreground" : "bg-card hover:bg-card/80"
                    )}
                  >
                    All
                  </button>
                  {semesters.map((sem) => (
                    <button
                      key={sem.id}
                      onClick={() => updateFilter('semester', sem.id)}
                      className={cn(
                        "px-3 py-1.5 rounded-lg text-sm transition-colors",
                        selectedSemester === sem.id ? "bg-primary text-primary-foreground" : "bg-card hover:bg-card/80"
                      )}
                    >
                      Sem {sem.number}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sort */}
              <div>
                <label className="text-sm font-medium mb-2 block">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => updateFilter('sort', e.target.value)}
                  className="w-full md:w-auto px-4 py-2 bg-card rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Clear Filters */}
              {hasActiveFilters && (
                <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-1">
                  <X className="h-4 w-4" />
                  Clear All Filters
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="container mx-auto px-4 py-8">
        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-muted-foreground">
            <span className="font-medium text-foreground">{filteredContent.length}</span> items found
          </p>
          
          {/* Desktop Sort */}
          <div className="hidden md:flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => updateFilter('sort', e.target.value)}
              className="px-3 py-1.5 bg-secondary rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Content Grid */}
        {filteredContent.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredContent.map((item) => (
              <ContentCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No results found</h3>
            <p className="text-muted-foreground mb-4">Try adjusting your filters or search query</p>
            <Button variant="outline" onClick={clearFilters}>Clear Filters</Button>
          </div>
        )}
      </div>
    </div>
  );
}
