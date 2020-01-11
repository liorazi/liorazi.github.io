#!/bin/bash
echo "About to push new tag.csv to github..."
echo "Checking out repo..."
mkdir repo
cd repo
echo "Cloning repo..."
git clone https://github.com/liorazi/liorazi.github.io.git
cp ../tag.csv .
git add tag.csv
git commit -m "Heroku: Update tag.csv"
echo "Pushing new csv to repo..."
git push origin master
