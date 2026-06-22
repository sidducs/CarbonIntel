# Database Design (Future Ready Roadmap)

This document outlines the proposed relational database schema designed to transition CarbonIntel from local storage to a persistent database backend.

---

## 1. Entity Relationship (ER) Diagram Description

The database design uses a relational model with a primary `farms` table linked to assessments, local weather configurations, and settings:

```text
  [users] 1 -------- * [farms] 1 -------- * [assessments]
                         1                     1
                         |                     |
                         v                     v
                  [weather_cache]       [pdf_reports]
```

* **One-to-Many Relationships**:
  * A `User` can own multiple `Farms`.
  * A `Farm` can have multiple `Assessments` over different crop seasons.
  * A `Farm` can have multiple cached `Weather` logs.
  * An `Assessment` has a one-to-one relationship with its generated `PDF Report` metadata.

---

## 2. Table Schemas

### `users` (Account Credentials)
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| **id** | UUID | Primary Key | Unique user identifier |
| **email** | VARCHAR(255) | Unique, Not Null | Login email |
| **password_hash** | VARCHAR(255) | Not Null | Hashed password |
| **created_at** | TIMESTAMP | Default NOW() | User registration date |

### `farms` (Farm Locations)
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| **id** | UUID | Primary Key | Unique farm identifier |
| **user_id** | UUID | Foreign Key -> `users.id` | Farm owner |
| **name** | VARCHAR(100) | Not Null | Farm profile label |
| **latitude** | DECIMAL(9,6) | Not Null | Latitude coordinate |
| **longitude** | DECIMAL(9,6) | Not Null | Longitude coordinate |
| **village** | VARCHAR(100) | Nullable | Geocoded village |
| **taluk** | VARCHAR(100) | Nullable | Geocoded subdistrict |
| **district** | VARCHAR(100) | Nullable | Geocoded district |
| **state** | VARCHAR(100) | Nullable | Geocoded state |
| **postal_code** | VARCHAR(20) | Nullable | Geocoded postal ZIP |
| **created_at** | TIMESTAMP | Default NOW() | Profile creation timestamp |

### `assessments` (Soil & Emission Evaluations)
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| **id** | UUID | Primary Key | Unique run identifier |
| **farm_id** | UUID | Foreign Key -> `farms.id` | Associated farm |
| **crop_type** | VARCHAR(50) | Not Null | E.g. "Rice", "Sugarcane" |
| **soc** | DECIMAL(4,2) | Not Null | Soil Organic Carbon (%) |
| **n_content** | DECIMAL(5,2) | Not Null | Soil Nitrogen (mg/kg) |
| **p_content** | DECIMAL(5,2) | Not Null | Soil Phosphorus (mg/kg) |
| **k_content** | DECIMAL(5,2) | Not Null | Soil Potassium (mg/kg) |
| **ph** | DECIMAL(3,1) | Not Null | Soil pH value |
| **fertilizer_type**| VARCHAR(50) | Not Null | E.g. "Urea", "DAP" |
| **fertilizer_amount**| DECIMAL(6,2)| Not Null | Quantity applied (kg/ha) |
| **temperature** | DECIMAL(4,1) | Not Null | Temperature during run (°C) |
| **rainfall** | DECIMAL(6,1) | Not Null | Rainfall during run (mm/year) |
| **humidity** | DECIMAL(4,1) | Not Null | Humidity during run (%) |
| **carbon_footprint**| DECIMAL(6,1)| Not Null | Model output (kg CO₂e/ha) |
| **sustainability** | VARCHAR(20) | Not Null | Tier: "High"/"Medium"/"Low" |
| **carbon_credits** | DECIMAL(5,3) | Not Null | Earned offsets (tonnes) |
| **created_at** | TIMESTAMP | Default NOW() | Assessment date |

### `weather_cache` (External Weather Buffer)
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| **id** | BIGSERIAL | Primary Key | Log ID |
| **farm_id** | UUID | Foreign Key -> `farms.id` | Target farm location |
| **date** | DATE | Not Null | Weather date |
| **temperature_avg**| DECIMAL(4,1) | Not Null | Average daily temp (°C) |
| **precipitation_sum**| DECIMAL(5,1)| Not Null | Daily rainfall sum (mm) |
| **humidity_avg** | DECIMAL(4,1) | Not Null | Average daily humidity (%) |
| **created_at** | TIMESTAMP | Default NOW() | Cache insertion time |

### `pdf_reports` (Report Outputs)
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| **id** | UUID | Primary Key | Report ID |
| **assessment_id**| UUID | Foreign Key -> `assessments.id`| Source evaluation |
| **s3_url** | VARCHAR(512) | Not Null | Cloud bucket download URL |
| **file_size_bytes**| INTEGER | Not Null | File size |
| **created_at** | TIMESTAMP | Default NOW() | Export timestamp |

---

## 3. Database Indexes

To ensure high performance as the platform scales, the following indexes are proposed:
* `CREATE INDEX idx_farms_user ON farms(user_id);` (Speeds up loading a user's dashboard).
* `CREATE INDEX idx_assessments_farm ON assessments(farm_id);` (Speeds up loading historical charts for a farm).
* `CREATE UNIQUE INDEX idx_weather_date ON weather_cache(farm_id, date);` (Prevents duplicate weather cache entries).
