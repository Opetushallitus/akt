#!/bin/bash

# Fetch language list from koodisto, save returned json for backend to use, generate frontend localisation files.

mkdir -p ../src/main/resources/koodisto/

curl -H "Caller-Id:kehittaja-akt" "https://virkailija.opintopolku.fi/koodisto-service/rest/json/kieli/koodi" > ../src/main/resources/koodisto/koodisto_kielet.json

mkdir -p ../src/main/reactjs/public/i18n/koodisto/langs/

jq '[.[] | {key: .koodiArvo, value: .metadata[]|select(.kieli | contains("FI")).nimi }]|from_entries' ../src/main/resources/koodisto/koodisto_kielet.json | jq '. | {akt:{component:{publicTranslatorFilters:{languages:.}}}}' > ../src/main/reactjs/public/i18n/koodisto/langs/fi-FI.json
jq '[.[] | {key: .koodiArvo, value: .metadata[]|select(.kieli | contains("SV")).nimi }]|from_entries' ../src/main/resources/koodisto/koodisto_kielet.json | jq '. | {akt:{component:{publicTranslatorFilters:{languages:.}}}}' > ../src/main/reactjs/public/i18n/koodisto/langs/sv-SE.json
jq '[.[] | {key: .koodiArvo, value: .metadata[]|select(.kieli | contains("EN")).nimi }]|from_entries' ../src/main/resources/koodisto/koodisto_kielet.json | jq '. | {akt:{component:{publicTranslatorFilters:{languages:.}}}}' > ../src/main/reactjs/public/i18n/koodisto/langs/en-GB.json