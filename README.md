# Text File Comparison Tool

A web-based application to compare two text files side-by-side, showing differences with highlighting.

## Features

- **Side-by-side comparison**: New file on the left, old file on the right
- **Visual highlighting**: 
  - Green background for added lines
  - Red background with strikethrough for removed lines
  - Gray text for unchanged lines
- **Line numbers**: Easy reference for changes
- **Real-time comparison**: Compare as you type or paste content

## How to Deploy Locally

### Method 1: Run with .NET CLI (Requires .NET 8.0)
```bash
cd c:\Users\prakash.karuppaih\source\repos\CompareTextFile
dotnet run
```
Access at: `https://localhost:5001` or `http://localhost:5000`

### Method 2: Run Published Version (No .NET Required)
1. Navigate to the `publish` folder
2. Double-click `start-app.bat` or run `CompareTextFile.exe`
3. Open your browser and go to `http://localhost:5000`

### Method 3: Run from Visual Studio
1. Open `CompareTextFile.sln` in Visual Studio
2. Press F5 or click "Start Debugging"

## How to Use

1. **Paste your text**: 
   - Put the NEW file content in the LEFT text area
   - Put the OLD file content in the RIGHT text area

2. **Click "Compare Files"** to see the differences

3. **View Results**:
   - Added lines appear with green background
   - Removed lines appear with red background and strikethrough
   - Unchanged lines appear in gray

4. **Click "Clear All"** to reset and start over

## Technical Details

- Built with ASP.NET Core 8.0 Razor Pages
- Client-side JavaScript for text comparison
- Bootstrap for responsive UI
- Self-contained deployment (no .NET installation required for published version)

## File Structure

```
CompareTextFile/
├── Pages/
│   ├── Index.cshtml          # Main comparison interface
│   └── Index.cshtml.cs       # Page model
├── wwwroot/
│   ├── css/site.css          # Styling for comparison view
│   └── js/site.js            # Text comparison logic
└── publish/                  # Self-contained deployment
    ├── CompareTextFile.exe   # Executable
    └── start-app.bat         # Easy startup script
```