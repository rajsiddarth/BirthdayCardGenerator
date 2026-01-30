# Birthday Card Generator

A simple web app that creates a colorful, personalized birthday card from a name, age, and a few characteristics.

## Features

- **Inputs**: Name, age, and characteristics (comma-separated, e.g. *kind, funny, adventurous*)
- **Card**: Colorful layout with a celebration image at the top and a personalized birthday message
- **Download**: Save the card as a PNG image
- **Create another**: Reset the form and make a new card

## How to run

1. Open `index.html` in a modern browser (Chrome, Firefox, Safari, Edge), or
2. Serve the folder with a local server (recommended if images don’t load due to CORS):

   ```bash
   # Python 3
   python -m http.server 8000

   # Node (npx)
   npx serve .
   ```

3. In the browser, go to `http://localhost:8000` (or the URL your server shows).

## Usage

1. Enter the **name** of the person.
2. Enter their **age**.
3. Optionally add **characteristics** (e.g. *kind, funny, creative*), separated by commas.
4. Click **Generate Card**.
5. Use **Download Card** to save the card as an image, or **Create Another** to make a new one.

## Tech

- Plain HTML, CSS, and JavaScript
- [html2canvas](https://html2canvas.hertzen.com/) for exporting the card as PNG
- [Google Fonts](https://fonts.google.com/) (Fredoka, Quicksand)
- [Unsplash](https://unsplash.com/) for celebration images (used via direct URLs)

No build step or backend required.
