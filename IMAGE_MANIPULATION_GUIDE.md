# Image Manipulation Guide for CustomEditor

## Current Status

The CustomEditor now has full CSS support for image manipulation. However, to enable **drag-to-resize** functionality, you need to install the image resize package.

## Installation Required

Run this command in **Command Prompt** (not PowerShell):

```cmd
cd client
npm install
```

This will install the `quill-image-resize-module-react` package that's already in your `package.json`.

## How to Use Image Features

### 1. **Insert an Image**
- Click the image icon in the toolbar
- Paste an image URL or upload an image

### 2. **Resize Images** (after package installation)
- Click on the image
- Drag the corner handles to resize
- The image dimensions will be displayed while resizing

### 3. **Wrap Text Around Images** (Improved)

We have added **dedicated toolbar buttons** for this!

**Method 1: Using Toolbar Buttons (Recommended)**
1. **Click on the image** to select it.
2. Look at the **Full Description** section header.
3. Click the **Float Left** or **Float Right** button.
   - **Float Left**: Image moves to left, text wraps on right.
   - **Float Right**: Image moves to right, text wraps on left.
4. Margins are automatically added for perfect spacing.

**Method 2: Manual HTML (Fallback)**
1. In the editor, click the "Source" or "Code" view (if available)
2. Find your image tag: `<img src="...">`
3. Add the float style:
   ```html
   <img src="your-image.jpg" style="float: left; width: 300px;">
   ```
   or
   ```html
   <img src="your-image.jpg" style="float: right; width: 300px;">
   ```

**Method 3: After Inserting Image**
1. Insert the image
2. Click on the image
3. In the browser console, run:
   ```javascript
   document.querySelector('.ql-editor img').style.float = 'left';
   ```

### 4. **Image Alignment**
- Use the alignment buttons in the toolbar (left, center, right, justify)
- This will align the entire paragraph containing the image

## CSS Features Already Working

✅ **Responsive Images**: Images automatically scale to fit container
✅ **Text Wrapping**: Text flows around images with `float: left` or `float: right`
✅ **Proper Margins**: 15px spacing around wrapped images
✅ **Border Radius**: 4px rounded corners on all images
✅ **Dark Mode Support**: Images look good in both light and dark themes

## After Installing the Package

Once you run `npm install`, you'll get:
- ✅ Drag-to-resize handles on images
- ✅ Live dimension display while resizing
- ✅ Aspect ratio preservation
- ✅ Visual resize toolbar

## Troubleshooting

**If images don't resize after installation:**
1. Restart the dev server (`npm run dev`)
2. Clear browser cache (Ctrl + Shift + R)
3. Check browser console for errors

**If text doesn't wrap around images:**
- Make sure the image has `float: left` or `float: right` in its style attribute
- The CSS is already in place, you just need to add the float property to the image
