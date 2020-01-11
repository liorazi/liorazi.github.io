import json
import pandas as pd
import requests
import subprocess

print("Downloading Tag JSON...")
items = requests.get('https://data.gov.il/api/action/datastore_search?resource_id=c8b9f9c8-4612-4068-934f-d4acd2e3c06e&limit=1000000')
data = items.json()
records = data["result"]["records"]

print("Loading Tag JSON...")
tag_flattened = []
for line in records:
  tag_flattened.append({
   "MISPAR RECHEV" : line['MISPAR RECHEV'],
   "TAARICH HAFAKAT TAG" : line['TAARICH HAFAKAT TAG'],
   "SUG TAV" : line['SUG TAV']
})

df = pd.DataFrame(tag_flattened)
df['MISPAR RECHEV'] = df['MISPAR RECHEV'].apply('{0:0>8}'.format)
df['SUG TAV'] = df['SUG TAV'].apply('{0:0>2}'.format)

print("Saving JSON to CSV File")
df.to_csv('tag.csv', sep='|', index=None)
rc = subprocess.call("release.sh")
