# Implementation Plan

- [x] 1. Set up project structure and core interfaces





  - Create PatientSelection directory structure under src/components
  - Define TypeScript interfaces for PatientData, PatientSearchResult, and RecentPatient
  - Create barrel exports for the new components
  - _Requirements: 7.1, 7.2, 7.3_

- [x] 2. Implement PatientSelectionSection component







  - [x] 2.1 Create PatientSelectionSection component with empty state



    - Build component that shows "Seleccione un paciente" message when no patient is selected
    - Add "Seleccionar Paciente" button that triggers modal opening
    - Style with dashed border and informative icon
    - _Requirements: 1.1, 1.2, 1.3_


  - [x] 2.2 Add selected patient display functionality

    - Implement SelectedPatientInfo component to show patient details
    - Display patient name, ID, age, gender, blood type
    - Add "Cambiar paciente" button
    - _Requirements: 4.1, 4.2, 5.1_


  - [x] 2.3 Implement medical alerts display

    - Show allergies section with warning icons and red styling
    - Display chronic conditions with appropriate styling
    - Show current medications with blue styling
    - _Requirements: 4.3, 4.4, 4.5, 4.6_

- [ ] 3. Create PatientSelectionModal with tabs structure
  - [ ] 3.1 Build modal shell with tab navigation
    - Create modal using existing Dialog component
    - Implement Tabs with "Pacientes Recientes" and "Búsqueda Avanzada"
    - Add modal header with title and close functionality
    - _Requirements: 2.1, 2.2_

  - [ ] 3.2 Add footer with "Nuevo Paciente" button
    - Implement footer section with patient count info
    - Add "Nuevo Paciente" button that opens NewPatientDialog
    - Handle modal state management between parent and child modals
    - _Requirements: 3.1, 3.2_

- [ ] 4. Implement RecentPatientsTab component
  - [ ] 4.1 Create recent patients list display
    - Build component that shows list of recent patients (mock data initially)
    - Display patient cards with name, ID, age, last visit info
    - Add "Seleccionar" button for each patient
    - _Requirements: 2.3_

  - [ ] 4.2 Add medical alerts indicators in patient cards
    - Show allergy indicators with warning icons
    - Display chronic conditions with info icons
    - Show medication count badge
    - _Requirements: 2.5_

- [ ] 5. Implement AdvancedSearchTab component
  - [ ] 5.1 Create search interface
    - Build search input with placeholder text
    - Add dropdown for search criteria (name, ID, phone, etc.)
    - Implement minimum character validation (2 chars)
    - _Requirements: 2.4_

  - [ ] 5.2 Add search results display
    - Show search results in card format similar to recent patients
    - Display "No results found" message when appropriate
    - Add loading state during search
    - _Requirements: 2.4_

  - [ ]* 5.3 Implement real-time search functionality
    - Add debounced search to avoid excessive API calls
    - Filter mock patient data based on search criteria
    - Handle search state management
    - _Requirements: 2.4_

- [ ] 6. Modify NewPatientDialog for reusability
  - [ ] 6.1 Add callback props for patient creation
    - Modify existing NewPatientDialog to accept onPatientCreated callback
    - Ensure component can be used from different contexts
    - Maintain existing functionality and styling
    - _Requirements: 3.3, 7.1, 7.2_

  - [ ] 6.2 Integrate with PatientSelectionModal
    - Handle opening NewPatientDialog from PatientSelectionModal
    - Implement automatic patient selection after creation
    - Close both modals after successful patient creation
    - _Requirements: 3.3, 3.4_

- [ ] 7. Integrate with PrescriptionPage
  - [ ] 7.1 Add patient selection state to PrescriptionPage
    - Add selectedPatient state to PrescriptionPage component
    - Implement patient selection and change handlers
    - Update component to handle patient data flow
    - _Requirements: 1.1, 5.1, 5.2_

  - [ ] 7.2 Implement medication button control logic
    - Disable "Agregar Medicamento" button when no patient is selected
    - Enable button when patient is selected
    - Add tooltip explaining why button is disabled
    - _Requirements: 6.1, 6.2, 6.3, 6.4_

  - [ ] 7.3 Add PatientSelectionSection to PrescriptionPage layout
    - Insert PatientSelectionSection after the header banner
    - Ensure proper spacing and layout integration
    - Test responsive behavior on different screen sizes
    - _Requirements: 1.1_

- [ ] 8. Implement patient data management
  - [ ] 8.1 Create mock patient data service
    - Create mock data for recent patients (10-15 patients)
    - Include realistic patient information with medical alerts
    - Implement search functionality over mock data
    - _Requirements: 2.3, 2.4, 2.5_

  - [ ] 8.2 Add patient selection logic
    - Implement patient selection from both tabs
    - Handle patient data validation before selection
    - Ensure selected patient data is properly formatted
    - _Requirements: 2.3, 2.4, 4.1, 4.2_

- [ ] 9. Add error handling and validation
  - [ ] 9.1 Implement form validation
    - Validate minimum search characters in advanced search
    - Handle empty search results gracefully
    - Add error states for failed patient loading
    - _Requirements: 2.4_

  - [ ] 9.2 Add user feedback with toasts
    - Show success toast when patient is selected
    - Display error toasts for validation failures
    - Add informative messages for user actions
    - _Requirements: 1.3, 3.4, 5.2_

- [ ] 10. Style and polish components
  - [ ] 10.1 Apply consistent styling
    - Use existing design system colors and spacing
    - Ensure proper contrast for medical alert sections
    - Add hover states and transitions for interactive elements
    - _Requirements: 4.3, 4.4, 4.5_

  - [ ] 10.2 Implement responsive design
    - Ensure modal works properly on mobile devices
    - Adapt patient cards for smaller screens
    - Test tab navigation on touch devices
    - _Requirements: 2.1, 2.2_

- [ ]* 11. Add comprehensive testing
  - [ ]* 11.1 Write unit tests for all components
    - Test PatientSelectionSection rendering and interactions
    - Test modal opening/closing and tab switching
    - Test patient selection and data flow
    - _Requirements: All requirements_

  - [ ]* 11.2 Add integration tests
    - Test complete patient selection flow
    - Test new patient creation and automatic selection
    - Test medication button enable/disable logic
    - _Requirements: 1.1, 3.3, 6.1, 6.2_

- [ ] 12. Final integration and testing
  - [ ] 12.1 Test complete user workflow
    - Test selecting patient from recent patients tab
    - Test advanced search and patient selection
    - Test creating new patient and automatic selection
    - Test changing selected patient
    - _Requirements: All requirements_

  - [ ] 12.2 Verify medical alerts display correctly
    - Ensure allergies show with proper warning styling
    - Verify chronic conditions display appropriately
    - Test current medications section
    - _Requirements: 4.3, 4.4, 4.5, 4.6_

  - [ ] 12.3 Validate accessibility and usability
    - Test keyboard navigation through modal and tabs
    - Verify screen reader compatibility
    - Ensure proper focus management
    - Test on different browsers and devices
    - _Requirements: All requirements_