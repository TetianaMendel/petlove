"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Select, {
  type SingleValue,
  type InputActionMeta,
} from "react-select";
import { FiSearch, FiRotateCcw, FiX } from "react-icons/fi";
import SearchField from "@/components/SearchField/SearchField";
import FilterSelect from "@/components/FilterSelect/FilterSelect";
import {
  fetchNoticeCategories,
  fetchNoticeSex,
  fetchNoticeSpecies,
  fetchCities,
} from "@/lib/clientApi";
import type {
  NoticeCategory,
  NoticeSex,
  SortOption,
} from "@/types/notices";
import type { City } from "@/types/cities";
import styles from "./NoticesFilters.module.css";

interface NoticesFiltersProps {
  onKeywordChange: (keyword: string) => void;

  category?: NoticeCategory;
  onCategoryChange: (
    value: NoticeCategory | undefined
  ) => void;

  sex?: NoticeSex;
  onSexChange: (
    value: NoticeSex | undefined
  ) => void;

  species?: string;
  onSpeciesChange: (
    value: string | undefined
  ) => void;

  locationId?: string;
  onLocationChange: (
    value: string | undefined
  ) => void;

  sort: SortOption | null;
  onSortChange: (value: SortOption | null) => void;

  onReset: () => void;
  resetKey: number;
  hasActiveFilters: boolean;
}

interface LocationOption {
  value: string;
  label: string;
}

const sortOptions: SortOption[] = [
  "Popular",
  "Unpopular",
  "Cheap",
  "Expensive",
];

export default function NoticesFilters({
  onKeywordChange,
  category,
  onCategoryChange,
  sex,
  onSexChange,
  species,
  onSpeciesChange,
  locationId,
  onLocationChange,
  sort,
  onSortChange,
  onReset,
  resetKey,
  hasActiveFilters,
}: NoticesFiltersProps) {
  const [locationInput, setLocationInput] = useState("");

  const [debouncedLocation, setDebouncedLocation] =
    useState("");

  const [selectedLocation, setSelectedLocation] =
    useState<LocationOption | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedLocation(locationInput.trim());
    }, 300);

    return () => clearTimeout(timer);
  }, [locationInput]);

  const { data: categories = [] } = useQuery({
    queryKey: ["notice-categories"],
    queryFn: fetchNoticeCategories,
  });

  const { data: sexes = [] } = useQuery({
    queryKey: ["notice-sex"],
    queryFn: fetchNoticeSex,
  });

  const { data: speciesOptions = [] } = useQuery({
    queryKey: ["notice-species"],
    queryFn: fetchNoticeSpecies,
  });

  const {
    data: cities = [],
    isFetching: isCitiesLoading,
  } = useQuery({
    queryKey: ["cities", debouncedLocation],
    queryFn: () => fetchCities(debouncedLocation),
    enabled: debouncedLocation.length >= 3,
  });

  const locationOptions: LocationOption[] = cities.map(
    (city: City) => ({
      value: city._id,
      label: [
        city.cityEn,
        city.stateEn,
        city.countyEn,
      ]
        .filter(Boolean)
        .join(", "),
    })
  );

  const handleLocationInputChange = (
    value: string,
    actionMeta: InputActionMeta
  ) => {
    if (actionMeta.action === "input-change") {
      setLocationInput(value);
    }

    return value;
  };

  const handleLocationChange = (
    option: SingleValue<LocationOption>
  ) => {
    setSelectedLocation(option);
    setLocationInput("");
    setDebouncedLocation("");
    onLocationChange(option?.value);
  };

  const handleSortChange = (option: SortOption) => {
    onSortChange(sort === option ? null : option);
  };

  const handleReset = () => {
    setLocationInput("");
    setDebouncedLocation("");
    setSelectedLocation(null);
    onReset();
  };

  const currentLocation =
    locationId === selectedLocation?.value
      ? selectedLocation
      : null;

  return (
    <div className={styles.filters}>
      <div className={styles.fields}>
        <div className={styles.searchWrapper}>
          <SearchField
            key={resetKey}
            onSearch={onKeywordChange}
            placeholder="Search"
          />
        </div>

        <div className={styles.selectRow}>
          <FilterSelect<NoticeCategory>
            placeholder="Category"
            options={categories}
            value={category}
            onChange={onCategoryChange}
          />

          <FilterSelect<NoticeSex>
            placeholder="By gender"
            options={sexes}
            value={sex}
            onChange={onSexChange}
          />
        </div>

        <div className={styles.speciesWrapper}>
          <FilterSelect<string>
            placeholder="By type"
            options={speciesOptions}
            value={species}
            onChange={onSpeciesChange}
          />
        </div>

        <div className={styles.locationWrapper}>
          <Select<LocationOption, false>
            key={resetKey}
            instanceId="notice-location"
            inputId="notice-location"
            aria-label="Location"
            className={styles.locationSelect}
            classNamePrefix="location-select"
            options={
              locationInput.trim().length >= 3
                ? locationOptions
                : []
            }
            value={currentLocation}
            inputValue={locationInput}
            onInputChange={handleLocationInputChange}
            onChange={handleLocationChange}
            placeholder="Location"
            isClearable
            isLoading={isCitiesLoading}
            isSearchable
            filterOption={null}
            noOptionsMessage={() =>
              locationInput.trim().length < 3
                ? "Enter at least 3 characters"
                : "No locations found"
            }
            components={{
              DropdownIndicator: () => (
                <FiSearch
                  size={18}
                  aria-hidden="true"
                />
              ),
              IndicatorSeparator: () => null,
            }}
            styles={{
              control: (base) => ({
                ...base,
                minHeight: "100%",
                height: "100%",
                border: "none",
                borderRadius: 30,
                boxShadow: "none",
                backgroundColor: "#fff",
                cursor: "text",
              }),

              valueContainer: (base) => ({
                ...base,
                padding: "0 12px",
              }),

              placeholder: (base) => ({
                ...base,
                color: "rgba(38, 38, 38, 0.5)",
                fontSize: 14,
                fontWeight: 500,
                lineHeight: "18px",
              }),

              input: (base) => ({
                ...base,
                color: "#262626",
                fontSize: 14,
                fontWeight: 500,
              }),

              singleValue: (base) => ({
                ...base,
                color: "#262626",
                fontSize: 14,
                fontWeight: 500,
              }),

              indicatorsContainer: (base) => ({
                ...base,
                paddingRight: 12,
              }),

              menu: (base) => ({
                ...base,
                borderRadius: 12,
                overflow: "hidden",
                zIndex: 30,
              }),

              option: (base, state) => ({
                ...base,
                backgroundColor: state.isFocused
                  ? "#fff4df"
                  : "#fff",
                color: "#262626",
                cursor: "pointer",
              }),
            }}
          />
        </div>
      </div>

      <div className={styles.sort}>
        {sortOptions.map((option) => (
          <button
            key={option}
            type="button"
            className={`${styles.sortButton} ${
              sort === option
                ? styles.sortButtonActive
                : ""
            }`}
            onClick={() => handleSortChange(option)}
            aria-pressed={sort === option}
          >
            {option}

            {sort === option && (
              <FiX size={16} aria-hidden="true" />
            )}
          </button>
        ))}

        {hasActiveFilters && (
          <button
            type="button"
            className={styles.resetButton}
            onClick={handleReset}
          >
            <FiRotateCcw
              size={16}
              aria-hidden="true"
            />
            <span>Reset</span>
          </button>
        )}
      </div>
    </div>
  );
}