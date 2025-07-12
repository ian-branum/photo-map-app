# Photo Mapping App - UX Concept

## App Overview
**Name Suggestion**: "SightMap" or "PhotoTrace"
**Tagline**: "Map your visual journey"

## Core Navigation Structure

### Main Tab Bar (Bottom Navigation)
1. **Capture** 📸 - Take photos mode
2. **Sites** 🗺️ - Edit site visits
3. **View** 👁️ - View site visits
4. **Profile** 👤 - Settings, device info, exports

## 1. Capture Mode (Take Photos)

### Main Camera Interface
- **Full-screen camera viewfinder** with overlay UI
- **Top bar elements**:
  - Current site name (if active) with edit button
  - GPS signal strength indicator
  - Compass heading display
  - Settings gear icon
- **Bottom interface**:
  - Photo gallery thumbnail (last taken photo)
  - Large circular shutter button
  - Switch camera button (front/back)
  - Flash toggle

### Camera Controls (Slide-up Panel)
- **Focus controls**: Tap to focus, manual focus slider
- **Exposure controls**: EV compensation slider, exposure lock toggle
- **Grid overlay toggle** (rule of thirds)
- **Level indicator** (bubble level)

### Post-Capture Review Screen
- **Split-screen layout**:
  - Top half: Photo just taken with pinch-to-zoom
  - Bottom half: Interactive map showing:
    - Red dot for photo location
    - Semicircle showing camera angle/field of view (auto-snapped to lens used)
    - Compass rose indicating orientation
- **Adjustment controls**:
  - Drag the red dot to adjust GPS coordinates
  - Rotate the semicircle to adjust camera direction
  - Lens selector (0.5x, 1x, 5x) - updates semicircle to match optical FOV
- **Action buttons**:
  - "Keep" (saves photo with current location/angle data)
  - "Retake" (returns to camera)
  - "Add to Site" (if not already part of a site visit)

### Site Visit Creation (In Capture Mode)
- **Quick site creation**: Long-press on site name area
- **Site setup popup**:
  - Site name input field
  - Start time (auto-populated)
  - Purpose/description (optional)
  - Privacy settings (personal/shareable)

## 2. Sites Mode (Edit Site Visits)

### Sites List View
- **Card-based layout** for each site visit:
  - Hero image (first or selected photo)
  - Site name and date
  - Photo count badge
  - Duration of visit
  - Small preview map thumbnail
- **Actions per card**:
  - Tap to open site editor
  - Swipe for quick actions (rename, duplicate, delete)
- **Top controls**:
  - Search bar for sites
  - Filter/sort options (date, name, photo count)
  - "New Site" button

### Site Editor Interface
- **Top section**: Site metadata
  - Editable site name
  - Date/time range
  - Description field
  - Tags/categories
- **Main area**: Split between map and photo grid
  - **Map view** (60% of screen):
    - All photo locations as numbered pins
    - Photo angles as colored semicircles
    - Path lines connecting photos chronologically
    - Zoom/pan controls
  - **Photo grid** (40% of screen):
    - Thumbnail grid of all photos
    - Numbers matching map pins
    - Drag to reorder sequence

### Individual Photo Editor
- **Full-screen photo view** with map overlay
- **Precision adjustment tools**:
  - Fine-tune GPS coordinates with +/- buttons
  - Compass wheel for exact angle adjustment
  - Lens selector buttons (0.5x, 1x, 5x) - snaps semicircle to exact FOV
  - Timestamp adjustment
- **Photo metadata display**:
  - Camera settings (aperture, shutter speed, ISO)
  - Device/camera model
  - Original vs. adjusted coordinates

## 3. View Mode (Slideshow + Map)

### Viewing Interface Layout
- **Picture-in-picture style**:
  - Large photo display (70% of screen)
  - Map overlay in corner (30% of screen, expandable)
  - OR split-screen option for landscape orientation

### Slideshow Controls
- **Timeline scrubber** at bottom:
  - Thumbnails of all photos in sequence
  - Current position indicator
  - Tap any thumbnail to jump to that photo
- **Playback controls**:
  - Play/pause automatic slideshow
  - Previous/next photo buttons
  - Speed control (1x, 2x, 0.5x)
  - Loop toggle

### Map Animation Features
- **Animated transitions**:
  - Camera "flies" from point to point
  - Photo location pins animate in
  - Viewing angle semicircles fade in/out
  - Path traces draw progressively
- **Map interaction**:
  - Tap map to expand to full screen
  - Pinch to zoom on specific areas
  - Toggle different map layers (satellite, terrain, street)

### Alternative View Modes
- **Story mode**: Photo fades in/out with map animations
- **Explorer mode**: Map-focused with photo thumbnails
- **Comparison mode**: Side-by-side before/after of location changes

## 4. Profile & Settings

### Device Information
- **Camera specifications**:
  - Detected device model
  - Available lenses and their optical field of view angles
  - Automatic lens detection from EXIF data
  - Manual lens override for corrections
- **GPS settings**:
  - Location accuracy preferences
  - Offline map downloads
  - Coordinate system preferences

### Export & Sharing
- **Export options**:
  - Photo bundle with GPS data
  - Interactive web map
  - Video slideshow creation
  - GPX track export
- **Sharing features**:
  - Social media integration
  - Collaborative site visits
  - Public/private site settings

## Technical Considerations

### Data Structure
- **Photo objects** contain:
  - Image file
  - GPS coordinates (original + adjusted)
  - Camera angle/direction
  - Timestamp
  - Device/camera metadata
  - Site visit ID
- **Site visits** contain:
  - Metadata (name, date, description)
  - Array of photo IDs
  - Viewing preferences
  - Sharing settings

### Performance Optimizations
- **Progressive loading**: Load photos as needed during viewing
- **Thumbnail caching**: Pre-generate thumbnails for quick navigation
- **Map tile caching**: Offline map support for remote locations
- **Battery optimization**: Efficient GPS and camera usage

## User Experience Flow

### Typical User Journey
1. **Start site visit**: Open app → Capture mode → Create new site
2. **Take photos**: Multiple photos with automatic location/angle capture
3. **Quick review**: Adjust locations/angles if needed
4. **Edit later**: Sites mode → Fine-tune photo positions and site details
5. **Share/view**: View mode → Experience the visual journey

### Onboarding Experience
- **Tutorial**: Interactive walkthrough of each mode
- **Permissions**: Camera, location, storage access with clear explanations
- **Sample site**: Pre-loaded example to demonstrate viewing mode
- **Tips system**: Contextual hints for optimal photo mapping

## Technical Considerations
### Camera Implementation

Use expo-camera for capture with access to lens switching
expo-media-library for photo storage and EXIF data extraction
The lens detection can be done via EXIF focal length data or camera API

### Geospatial Data

Supabase PostGIS for storing photo coordinates and site boundaries
Consider storing camera direction as azimuth degrees (0-360°)
Index geospatial columns for efficient querying

### Offline Capabilities

expo-sqlite for local caching of sites and photos
expo-file-system for managing offline photo storage
Sync strategy when connectivity returns

