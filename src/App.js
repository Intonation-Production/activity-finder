import React, { useState, useEffect } from "react";
import "./App.css"; // We'll put custom styles here

const ActivityFinder = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeActivity, setActiveActivity] = useState(null);
  const [selectedAgeGroup, setSelectedAgeGroup] = useState("");
  const [selectedStyle, setSelectedStyle] = useState("");

  // Load activities data on component mount
  useEffect(() => {
    const loadActivities = async () => {
      try {
        setLoading(true);

        // Try to import JSON first, fallback to fetch if that fails
        try {
          setActivities(activitiesData);
        } catch (importError) {
          console.log("Import failed, trying fetch...");
          // Fallback to fetch from public folder
          const response = await fetch("/activities.json");
          const fetchedData = await response.json();
          setActivities(fetchedData);
        }

        setLoading(false);
      } catch (err) {
        setError("Failed to load activities data");
        setLoading(false);
        console.error("Error loading activities:", err);
      }
    };

    loadActivities();
  }, []);

  // Get unique values for filters
  const allCategories = [
    ...new Set(activities.flatMap((a) => a.category)),
  ].sort();
  const ageGroups = ["All Ages", "Elementary", "Middle School", "High School"];
  const styles = [...new Set(activities.map((a) => a.style))]
    .filter(Boolean)
    .sort();

  // Filter activities
  const filteredActivities = activities.filter((activity) => {
    const categoryMatch =
      selectedCategories.length === 0 ||
      selectedCategories.every((cat) => activity.category.includes(cat));

    const searchMatch =
      searchTerm === "" ||
      activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.purpose.toLowerCase().includes(searchTerm.toLowerCase());

    const ageMatch =
      selectedAgeGroup === "" || activity.ageGroup === selectedAgeGroup;
    const styleMatch = selectedStyle === "" || activity.style === selectedStyle;

    return categoryMatch && searchMatch && ageMatch && styleMatch;
  });

  const toggleCategory = (category) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(
        selectedCategories.filter((cat) => cat !== category)
      );
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSearchTerm("");
    setSelectedAgeGroup("");
    setSelectedStyle("");
  };

  const formatInstructions = (text) => {
    return text.split("\n").map((line, index) => {
      if (line.startsWith("• ") || line.startsWith("- ")) {
        return (
          <div key={index} className="ml-4 mb-1">
            {line}
          </div>
        );
      } else if (line.trim()) {
        return (
          <div key={index} className="mb-2">
            {line}
          </div>
        );
      }
      return <div key={index} className="mb-2"></div>;
    });
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="custom-orange-text text-xl mb-2">
            Loading activities...
          </div>
          <div className="text-gray-600">
            Please wait while we load your activity guide
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-4xl bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-2">
            Error loading activities
          </div>
          <div className="text-gray-600">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl bg-gray-50 min-h-screen">
      <header className="custom-orange-bg text-white p-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl futura-font">INTONATION ACTIVITY GUIDE</h1>
            <p className="text-sm futura-light">
              Find the right activity for your class
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm futura-light opacity-90">
              {activities.length} Activities
            </div>
            <div className="text-xs opacity-75">
              {activities.filter((a) => a.staffPick).length} Staff Picks
            </div>
          </div>
        </div>
      </header>

      {activeActivity ? (
        <div className="p-4">
          <button
            onClick={() => setActiveActivity(null)}
            className="mb-4 custom-orange-bg custom-orange-hover text-white px-3 py-1 rounded flex items-center text-sm futura-light"
          >
            ← Back to List
          </button>

          <div className="bg-white rounded-lg p-4 shadow">
            <div className="flex justify-between items-start mb-2">
              <h2 className="text-xl futura-font custom-orange-text">
                {activeActivity.title}
              </h2>
              {activeActivity.staffPick && (
                <span className="text-red-600 text-lg font-bold">✓</span>
              )}
            </div>

            <div className="mb-4">
              {activeActivity.category.map((cat) => (
                <span
                  key={cat}
                  className="inline-block custom-orange-light-bg custom-orange-text text-xs px-2 py-1 rounded mr-2 mb-2 futura-light"
                >
                  {cat}
                </span>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-2 text-sm mb-4 bg-gray-50 p-3 rounded">
              <div>
                <span className="futura-light font-medium">Time:</span>{" "}
                {activeActivity.time} minutes
              </div>
              <div>
                <span className="futura-light font-medium">Ages:</span>{" "}
                {activeActivity.ageGroup}
              </div>
              <div>
                <span className="futura-light font-medium">Style:</span>{" "}
                {activeActivity.style}
              </div>
              <div>
                <span className="futura-light font-medium">Materials:</span>{" "}
                {activeActivity.materials}
              </div>
            </div>

            <div className="mb-4">
              <h3 className="futura-font font-medium custom-orange-text mb-2">
                Description
              </h3>
              <p className="text-gray-700">{activeActivity.description}</p>
            </div>

            <div className="mb-4">
              <h3 className="futura-font font-medium custom-orange-text mb-2">
                Purpose
              </h3>
              <p className="text-gray-700">{activeActivity.purpose}</p>
            </div>

            <div className="mb-4">
              <h3 className="futura-font font-medium custom-orange-text mb-2">
                Instructions
              </h3>
              <div className="text-gray-700 bg-gray-50 p-3 rounded">
                {formatInstructions(activeActivity.instructions)}
              </div>
            </div>

            {activeActivity.notes && (
              <div className="mb-4">
                <h3 className="futura-font font-medium custom-orange-text mb-2">
                  Notes
                </h3>
                <p className="text-gray-700 bg-yellow-50 p-3 rounded">
                  {activeActivity.notes}
                </p>
              </div>
            )}

            {activeActivity.link && (
              <div>
                <a
                  href={activeActivity.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="custom-orange-bg text-white px-4 py-2 rounded hover:opacity-90 futura-light"
                >
                  View Resource Link
                </a>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="p-4">
          <div className="mb-4 bg-white p-4 rounded-lg shadow">
            <div className="mb-3">
              <input
                type="text"
                placeholder="Search activities by name, description, or purpose..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-3">
              <div>
                <label className="block text-sm futura-light font-medium mb-1">
                  Activity Style:
                </label>
                <select
                  value={selectedStyle}
                  onChange={(e) => setSelectedStyle(e.target.value)}
                  className="w-full p-2 border rounded text-sm"
                >
                  <option value="">All Styles</option>
                  {styles.map((style) => (
                    <option key={style} value={style}>
                      {style}
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2 flex items-end">
                <button
                  onClick={clearFilters}
                  className="bg-gray-500 text-white px-3 py-1 rounded text-sm w-full hover:bg-gray-600 futura-light"
                >
                  Clear All Filters
                </button>
              </div>
            </div>

            <div className="mb-2">
              <h3 className="futura-light font-medium text-sm mb-2">
                Filter by SEL Category (select multiple to narrow results):
              </h3>
              <div className="flex flex-wrap gap-1">
                {allCategories.map((category) => (
                  <button
                    key={category}
                    onClick={() => toggleCategory(category)}
                    className={`text-xs px-2 py-1 rounded transition-colors futura-light ${
                      selectedCategories.includes(category)
                        ? "custom-orange-bg text-white"
                        : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mb-4 text-sm text-gray-600 flex justify-between items-center">
            <span>
              Showing {filteredActivities.length} of {activities.length}{" "}
              activities
            </span>
            {selectedCategories.length > 0 && (
              <span className="custom-orange-text futura-light">
                {selectedCategories.length} categories selected
              </span>
            )}
          </div>

          <div className="space-y-3">
            {filteredActivities.length > 0 ? (
              filteredActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="bg-white p-4 rounded-lg shadow cursor-pointer hover:bg-orange-50 transition-colors relative"
                  onClick={() => setActiveActivity(activity)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="futura-font font-medium text-lg custom-orange-text pr-2">
                      {activity.title}
                    </h3>
                    <div className="flex items-center gap-2">
                      {activity.staffPick && (
                        <span className="text-red-600 text-lg font-bold">
                          ✓
                        </span>
                      )}
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded whitespace-nowrap futura-light">
                        {activity.time} min
                      </span>
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm mb-2">
                    {activity.description}
                  </p>

                  <div className="flex flex-wrap gap-1 mb-2">
                    {activity.category.slice(0, 4).map((cat) => (
                      <span
                        key={cat}
                        className="inline-block custom-orange-light-bg custom-orange-text text-xs px-2 rounded futura-light"
                      >
                        {cat}
                      </span>
                    ))}
                    {activity.category.length > 4 && (
                      <span className="text-xs text-gray-500">
                        +{activity.category.length - 4} more
                      </span>
                    )}
                  </div>

                  <div className="flex justify-between text-xs text-gray-500 futura-light">
                    <span>{activity.ageGroup}</span>
                    <span>{activity.style}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center p-8 bg-white rounded-lg shadow">
                <p className="text-gray-500 mb-2">
                  No activities match your current filters.
                </p>
                <button
                  onClick={clearFilters}
                  className="custom-orange-text hover:opacity-80 futura-light"
                >
                  Clear all filters to see all activities
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ActivityFinder;
