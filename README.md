# ServiceNow Auto-Fill Test Data Variable Set

This utility provides a way to quickly populate catalog item or record producer forms with test values for development and QA purposes.

## Features

- Triggered by a single checkbox variable
- Populates all visible variables with default values
- Recursively re-runs until all dependent questions (e.g., those revealed by UI Policies) are filled
- Handles a wide range of variable types:
  - Text, textarea, string
  - Choice, select box, radio buttons
  - Checkbox
  - Date and date/time
  - Reference fields with support for reference qualifiers

## Included Components

- Variable Set: Contains one checkbox variable named `fill_test_data`
- Client Script: Executes onChange of the checkbox
- Script Include: `ReferenceFetcher`, used to return the first valid sys_id and display value for a reference field

## Installation

1. Import the update set:
   - Navigate to **System Update Sets > Retrieved Update Sets**
   - Click **Import Update Set from XML**
   - Upload the XML file
   - Preview and commit the update set

2. Attach the variable set to any catalog item or record producer.


## Usage

When the form is rendered, check the "Fill Test Data" checkbox. All visible variables will be filled with dummy values. The script continues recursively until no further changes are needed.

## Notes

- The script avoids overwriting any field that is already filled
- A maximum of 5 recursive passes is allowed to avoid infinite loops

## File Contents (if viewing exported XML)

- Variable Set: Auto-Fill Test Data
- Variable: fill_test_data
- Catalog Client Script: onChange
- Script Include: ReferenceFetcher

## License

This utility is provided as-is for internal development and testing purposes.
