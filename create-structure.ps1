$structure = @(
    "src/components/layout/Header.jsx",
    "src/components/layout/BackButton.jsx",
    "src/components/layout/Footer.jsx",
    "src/components/cars/CarCard.jsx",
    "src/components/cars/CarForm.jsx",
    "src/components/cars/CarList.jsx",
    "src/components/services/ServiceEntryForm.jsx",
    "src/components/services/ServiceHistoryList.jsx",
    "src/components/services/ServiceDetailView.jsx",
    "src/components/technical/TechnicalDataForm.jsx",
    "src/pages/HomePage.jsx",
    "src/pages/AddCarPage.jsx",
    "src/pages/ServiceEntryPage.jsx",
    "src/pages/ServiceHistoryPage.jsx",
    "src/pages/ServiceDetailPage.jsx",
    "src/pages/TechnicalDataPage.jsx",
    "src/firebase/config.js",
    "src/firebase/carService.js",
    "src/firebase/serviceEntryService.js",
    "src/hooks/useCars.js",
    "src/hooks/useServiceEntries.js",
    "src/utils/formatters.js",
    "src/utils/validators.js",
    "src/App.jsx",
    "src/main.jsx",
    "src/index.css"
)

foreach ($item in $structure) {
    $fullPath = Join-Path -Path $PSScriptRoot -ChildPath $item
    $folder = Split-Path -Path $fullPath -Parent
    if (-not (Test-Path $folder)) {
        New-Item -ItemType Directory -Path $folder | Out-Null
    }
    New-Item -ItemType File -Path $fullPath -Force | Out-Null
}
