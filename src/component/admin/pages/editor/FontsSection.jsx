// import React, { useEffect, useState } from "react";
// import { observer } from "mobx-react-lite";
// import { FaFont } from "react-icons/fa";
// import { addGlobalFont } from "polotno/config";
// import { IP } from "../../../utils/Constent";
// import { SectionTab } from "polotno/side-panel";

// const FontsSection = observer(({ store }) => {
//   const [fonts, setFonts] = useState([]);

//   useEffect(() => {
//     const fetchFonts = async () => {
//       try {
//         const res = await fetch(`${IP}/api/v1/fonts`);
//         const fontData = await res.json();
//         setFonts(fontData);

//         // Register all fonts globally
//         fontData.forEach((font) => {
//           addGlobalFont({
//             fontFamily: font.family,
//             styles: [
//               {
//                 src: `url(${font.url})`,
//                 fontStyle: font.style,
//                 fontWeight: font.weight,
//               },
//             ],
//           });
//         });
//       } catch (err) {
//         console.error("Failed to load fonts:", err);
//       }
//     };

//     fetchFonts();
//   }, []);

//   const applyFont = (fontFamily) => {
//     // Create a new text element with the selected font
//     const textElement = store.activePage.addElement({
//       type: "text",
//       text: "Sample Text",
//       fontFamily,
//       fontSize: 40,
//       x: store.width / 2 - 100,
//       y: store.height / 2 - 20,
//     });

//     // Select the new element
//     store.selectElements([textElement]);
//   };

//   return (
//     <div style={{ height: "100%", overflowY: "auto", padding: "10px" }}>
//       <div
//         style={{
//           display: "grid",
//           gridTemplateColumns: "repeat(2, 1fr)",
//           gap: "10px",
//         }}
//       >
//         {fonts.map((font) => (
//           <div
//             key={font.family}
//             style={{
//               padding: "10px",
//               border: "1px solid #e1e1e1",
//               borderRadius: "4px",
//               cursor: "pointer",
//               textAlign: "center",
//               fontFamily: font.family,
//               transition: "all 0.2s",
//             }}
//             onClick={() => applyFont(font.family)}
//             onMouseEnter={(e) => (e.currentTarget.style.background = "#f5f5f5")}
//             onMouseLeave={(e) => (e.currentTarget.style.background = "white")}
//           >
//             {font.family}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// });

// export const FontsTab = {
//   name: "fonts",
//   Tab: (props) => (
//     <SectionTab name="Fonts" {...props}>
//       <div className="flex flex-col items-center space-y-1">
//         <FaFont />
//       </div>
//     </SectionTab>
//   ),
//   Panel: FontsSection,
// };

import React, { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { FaFont } from "react-icons/fa";
import { addGlobalFont } from "polotno/config";
import { IP } from "../../../utils/Constent";
import { SectionTab } from "polotno/side-panel";

const FontsSection = observer(({ store }) => {
  const [fonts, setFonts] = useState([]);
  useEffect(() => {
    const fetchFonts = async () => {
      try {
        const res = await fetch(`${IP}/api/v1/fonts`);
        const fontData = await res.json();
        setFonts(fontData);

        // Register all fonts with the store
        fontData.forEach((font) => {
          store.addFont({
            fontFamily: font.family,
            styles: [
              {
                src: `url("${font.url}")`,
                fontStyle: font.style || "normal",
                fontWeight: font.weight || "normal",
              },
            ],
          });
        });
      } catch (err) {
        console.error("Failed to load fonts:", err);
      }
    };

    fetchFonts();
  }, [store]); // Add store to dependency array

  const applyFont = (fontFamily) => {
    // Create a new text element with the selected font
    const textElement = store.activePage.addElement({
      type: "text",
      text: "Sample Text",
      fontFamily,
      fontSize: 40,
      x: store.width / 2 - 100,
      y: store.height / 2 - 20,
    });

    // Select the new element
    store.selectElements([textElement]);
  };

  return (
    <div style={{ height: "100%", overflowY: "auto", padding: "10px" }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "10px",
        }}
      >
        {fonts.map((font) => (
          <div
            key={font.family}
            style={{
              padding: "10px",
              border: "1px solid #e1e1e1",
              borderRadius: "4px",
              cursor: "pointer",
              textAlign: "center",
              fontFamily: font.family,
              transition: "all 0.2s",
            }}
            onClick={() => applyFont(font.family)}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#f5f5f5")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "white")}
          >
            {font.family}
          </div>
        ))}
      </div>
    </div>
  );
});

export const FontsTab = {
  name: "fonts",
  Tab: (props) => (
    <SectionTab name="Fonts" {...props}>
      <div className="flex flex-col items-center space-y-1">
        <FaFont />
      </div>
    </SectionTab>
  ),
  Panel: FontsSection,
};
