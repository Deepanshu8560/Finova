import React, { createContext, useContext, useState } from 'react';
import Papa from 'papaparse';

const DataContext = createContext({
  uploadFile: () => {},
  fileName: null,
  fileContent: null,
  parsedCsvData: null,
});

// eslint-disable-next-line react-refresh/only-export-components
export const useDataContext = () => useContext(DataContext);

export const DataProvider = ({ children }) => {
  const [fileName, setFileName] = useState(null);
  const [fileContent, setFileContent] = useState(null);
  const [parsedCsvData, setParsedCsvData] = useState(null);

  const uploadFile = (file) => {
    if (!file) return;
    
    setFileName(file.name);

    // Read the actual file content to power AI responses
    const reader = new FileReader();
    reader.onload = (e) => {
      setFileContent(e.target.result);
      
      // Parse layout structures natively for visual graphing
      Papa.parse(file, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        complete: function(results) {
          setParsedCsvData(results.data);
        }
      });
    };
    reader.onerror = () => setFileContent("Error: Could not read uploaded file content.");
    reader.readAsText(file);
  };

  return (
    <DataContext.Provider value={{ uploadFile, fileName, fileContent, parsedCsvData }}>
      {children}
    </DataContext.Provider>
  );
};
