import React, { useEffect, useState } from "react";
import { Tabs, Tab } from "@blueprintjs/core";
import { SectionTab } from "polotno/side-panel";
import { Shapes } from "lucide-react";
import { IP } from "../../../utils/Constent";
import { MdKeyboardBackspace } from "react-icons/md";

const GridButton = ({ src, alt, onClick }) => (
  <div
    onClick={onClick}
    style={{
      width: "80px",
      height: "80px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
    }}
  >
    <img
      src={src}
      alt={alt}
      style={{
        width: "100%",
        height: "100%",
        objectFit: "contain",
      }}
    />
  </div>
);

const GridDisplay = ({ data, onAdd }) => (
  <div
    style={{
      display: "grid",
      gridTemplateColumns: "repeat(2, 1fr)",
      gap: "10px",
      marginTop: "10px",
    }}
  >
    {Object.entries(data).map(([key, src]) => (
      <GridButton key={key} src={src} alt={key} onClick={() => onAdd(src)} />
    ))}
  </div>
);

const ImageDisplay = ({ data, onAdd }) => (
  <div
    style={{
      display: "grid",
      gridTemplateColumns: "repeat(2, 1fr)",
      gap: "10px",
      marginTop: "10px",
    }}
  >
    {data.map((item) => (
      <GridButton
        key={item._id}
        src={item.imageUrl}
        alt={item.name}
        onClick={() => onAdd(item.imageUrl)}
      />
    ))}
  </div>
);

const CategorySection = ({
  title,
  data,
  onAdd,
  keyName,
  setFocusedCategory,
}) => {
  let previewItems = [];

  if (Array.isArray(data)) {
    previewItems = data.slice(0, 4);
  } else if (typeof data === "object" && data !== null) {
    const flatObj = Object.entries(data).reduce((acc, [cat, items]) => {
      Object.entries(items).forEach(([key, value]) => {
        acc[key] = value;
      });
      return acc;
    }, {});
    previewItems = Object.entries(flatObj).slice(0, 4);
  }

  return (
    <div style={{ marginBottom: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h3>{title}</h3>
        <button onClick={() => setFocusedCategory(keyName)}>See all</button>
      </div>
      <div style={{ display: "flex", overflowX: "auto", gap: "10px" }}>
        {Array.isArray(previewItems[0])
          ? previewItems.map(([key, src]) => (
              <GridButton
                key={key}
                src={src}
                alt={key}
                onClick={() => onAdd(src)}
              />
            ))
          : previewItems.map((item, i) => (
              <GridButton
                key={item._id || i}
                src={item.imageUrl}
                alt={item.name}
                onClick={() => onAdd(item.imageUrl)}
              />
            ))}
      </div>
    </div>
  );
};

const CustomElements = {
  name: "custom-elements",
  Tab: (props) => (
    <SectionTab name="Elements" {...props}>
      <div className="flex flex-col items-center space-y-1">
        <Shapes size={18} />
      </div>
    </SectionTab>
  ),
  Panel: ({ store }) => {
    const [shapesData, setShapesData] = useState({});
    const [images, setImages] = useState([]);
    const [backgrounds, setBackgrounds] = useState([]);
    const [shapeTab, setShapeTab] = useState(null);
    const [focusedCategory, setFocusedCategory] = useState(null);

    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
      const delayDebounce = setTimeout(() => {
        fetchShapes();
        fetchImages();
        fetchBackgrounds();
      }, 300); // debounce 300ms

      return () => clearTimeout(delayDebounce);
    }, [searchTerm]);

    const fetchShapes = async () => {
      try {
        const url = `${IP}/api/v1/admin/shapes${
          searchTerm ? `?searchTerm=${encodeURIComponent(searchTerm)}` : ""
        }`;
        const res = await fetch(url);
        const data = await res.json();
        setShapesData(data);
        if (Object.keys(data).length && !shapeTab) {
          setShapeTab(Object.keys(data)[0]);
        }
      } catch (err) {
        console.error("Error fetching shapes", err);
      }
    };

    const fetchImages = async () => {
      try {
        const userId = localStorage.getItem("userID");
        const url = `${IP}/api/v1/images?userId=${userId}${
          searchTerm ? `&searchTerm=${encodeURIComponent(searchTerm)}` : ""
        }`;
        const res = await fetch(url);
        const data = await res.json();
        setImages(data);
      } catch (err) {
        console.error("Error fetching images", err);
      }
    };

    const fetchBackgrounds = async () => {
      try {
        const userId = localStorage.getItem("userID");
        const url = `${IP}/api/v1/backgrounds?userId=${userId}${
          searchTerm ? `&searchTerm=${encodeURIComponent(searchTerm)}` : ""
        }`;
        const res = await fetch(url);
        const data = await res.json();
        setBackgrounds(data);
      } catch (err) {
        console.error("Error fetching backgrounds", err);
      }
    };

    const addShape = (svg) => {
      const page = store.activePage || store.addPage();
      page.addElement({
        type: "svg",
        src: svg,
        width: 100,
        height: 100,
        x: 100,
        y: 100,
        resizable: true,
        lockUniScaling: false,
        keepRatio: false,
      });
    };

    const addImage = (url) => {
      const page = store.activePage || store.addPage();
      page.addElement({
        type: "image",
        src: url,
        width: 200,
        height: 200,
        x: 100,
        y: 100,
      });
    };

    const setBackground = (url) => {
      const page = store.activePage || store.addPage();
      // If background just needs the URL string
      page.set({
        background: url, // Just pass the URL string
      });
    };

    return (
      <div style={{ padding: "10px", height: "100%", overflowY: "auto" }}>
        {/* Search input */}
        <input
          type="text"
          placeholder="Search shapes, images, backgrounds..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-3 py-2 mb-4 border border-gray-300 rounded"
        />

        {focusedCategory ? (
          <>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h3 className="mt-4" style={{ marginBottom: 10 }}>
                {focusedCategory.charAt(0).toUpperCase() +
                  focusedCategory.slice(1)}
              </h3>
              <button
                className="hover:bg-amber-100 hover:rounded-xl px-2 "
                onClick={() => setFocusedCategory(null)}
              >
                <MdKeyboardBackspace className="text-2xl" />
              </button>
            </div>

            {focusedCategory === "shapes" && (
              <Tabs
                id="shapes-sub"
                selectedTabId={shapeTab}
                onChange={(id) => setShapeTab(id)}
                renderActiveTabPanelOnly
              >
                {Object.entries(shapesData).map(([category, items]) => (
                  <Tab
                    key={category}
                    id={category}
                    title={category}
                    panel={<GridDisplay data={items} onAdd={addShape} />}
                  />
                ))}
              </Tabs>
            )}

            {focusedCategory === "images" && (
              <ImageDisplay data={images} onAdd={addImage} />
            )}

            {focusedCategory === "backgrounds" && (
              <ImageDisplay data={backgrounds} onAdd={setBackground} />
            )}
          </>
        ) : (
          <>
            <CategorySection
              title="Element"
              data={shapesData}
              onAdd={addShape}
              keyName="shapes"
              setFocusedCategory={() => setFocusedCategory("shapes")}
            />

            <CategorySection
              title="Images"
              data={images}
              onAdd={addImage}
              keyName="images"
              setFocusedCategory={setFocusedCategory}
            />

            <CategorySection
              title="Backgrounds"
              data={backgrounds}
              onAdd={setBackground}
              keyName="backgrounds"
              setFocusedCategory={setFocusedCategory}
            />
          </>
        )}
      </div>
    );
  },
};

export default CustomElements;

// import React, { useEffect, useState } from "react";
// import { Tabs, Tab } from "@blueprintjs/core";
// import { SectionTab } from "polotno/side-panel";
// import { Shapes, Image as ImageIcon, PictureInPicture } from "lucide-react";
// import { IP } from "../../../utils/Constent";

// const GridButton = ({ src, alt, onClick }) => (
//   <div
//     onClick={onClick}
//     style={{
//       width: "80px",
//       height: "80px",
//       display: "flex",
//       alignItems: "center",
//       justifyContent: "center",
//       cursor: "pointer",
//     }}
//   >
//     <img
//       src={src}
//       alt={alt}
//       style={{
//         width: "100%",
//         height: "100%",
//         objectFit: "contain",
//       }}
//     />
//   </div>
// );

// const GridDisplay = ({ data, onAdd }) => (
//   <div
//     style={{
//       display: "grid",
//       gridTemplateColumns: "repeat(2, 1fr)",
//       gap: "10px",
//       marginTop: "10px",
//     }}
//   >
//     {Object.entries(data).map(([key, src]) => (
//       <GridButton key={key} src={src} alt={key} onClick={() => onAdd(src)} />
//     ))}
//   </div>
// );

// const ImageDisplay = ({ data, onAdd }) => (
//   <div
//     style={{
//       display: "grid",
//       gridTemplateColumns: "repeat(2, 1fr)",
//       gap: "10px",
//       marginTop: "10px",
//     }}
//   >
//     {data.map((item) => (
//       <GridButton
//         key={item._id}
//         src={item.imageUrl}
//         alt={item.name}
//         onClick={() => onAdd(item.imageUrl)}
//       />
//     ))}
//   </div>
// );

// const CustomElements = {
//   name: "custom-elements",
//   Tab: (props) => (
//     <SectionTab name="Elements" {...props}>
//       <div className="flex flex-col items-center space-y-1">
//         <Shapes size={18} />
//       </div>
//     </SectionTab>
//   ),
//   Panel: ({ store }) => {
//     const [shapesData, setShapesData] = useState({});
//     const [images, setImages] = useState([]);
//     const [backgrounds, setBackgrounds] = useState([]);
//     const [mainTab, setMainTab] = useState("shapes");
//     const [shapeTab, setShapeTab] = useState(null);

//     useEffect(() => {
//       fetchShapes();
//       fetchImages();
//       fetchBackgrounds();
//     }, []);

//     const fetchShapes = async () => {
//       try {
//         const res = await fetch(`${IP}/api/v1/admin/shapes`);
//         const data = await res.json();
//         setShapesData(data);
//         setShapeTab(Object.keys(data)[0]);
//       } catch (err) {
//         console.error("Error fetching shapes", err);
//       }
//     };

//     const fetchImages = async () => {
//       try {
//         const userId = localStorage.getItem("userID");
//         const res = await fetch(`${IP}/api/v1/images?userId=${userId}`);
//         const data = await res.json();
//         setImages(data);
//       } catch (err) {
//         console.error("Error fetching images", err);
//       }
//     };

//     const fetchBackgrounds = async () => {
//       try {
//         const userId = localStorage.getItem("userID");
//         const res = await fetch(`${IP}/api/v1/backgrounds?userId=${userId}`);
//         const data = await res.json();
//         setBackgrounds(data);
//       } catch (err) {
//         console.error("Error fetching backgrounds", err);
//       }
//     };

//     const addShape = (svg) => {
//       const page = store.activePage || store.addPage();
//       page.addElement({
//         type: "svg",
//         src: svg,
//         width: 100,
//         height: 100,
//         x: 100,
//         y: 100,
//         resizable: true,
//         lockUniScaling: false,
//         keepRatio: false,
//       });
//     };

//     const addImage = (url) => {
//       const page = store.activePage || store.addPage();
//       page.addElement({
//         type: "image",
//         src: url,
//         width: 200,
//         height: 200,
//         x: 100,
//         y: 100,
//       });
//     };

//     const setBackground = (url) => {
//       const page = store.activePage || store.addPage();
//       page.setBackgroundImage(url);
//     };

//     return (
//       <div style={{ padding: "10px", height: "100%", overflowY: "auto" }}>
//         <Tabs
//           id="main-tabs"
//           selectedTabId={mainTab}
//           onChange={(id) => setMainTab(id)}
//         >
//           <Tab
//             id="shapes"
//             title="Shapes"
//             panel={
//               <>
//                 <Tabs
//                   id="shapes-sub"
//                   selectedTabId={shapeTab}
//                   onChange={(id) => setShapeTab(id)}
//                   renderActiveTabPanelOnly
//                 >
//                   {Object.entries(shapesData).map(([category, items]) => (
//                     <Tab
//                       key={category}
//                       id={category}
//                       title={
//                         category.charAt(0).toUpperCase() + category.slice(1)
//                       }
//                       panel={<GridDisplay data={items} onAdd={addShape} />}
//                     />
//                   ))}
//                 </Tabs>
//               </>
//             }
//           />

//           <Tab
//             id="images"
//             title="Images"
//             panel={<ImageDisplay data={images} onAdd={addImage} />}
//           />

//           <Tab
//             id="backgrounds"
//             title="Backgrounds"
//             panel={<ImageDisplay data={backgrounds} onAdd={setBackground} />}
//           />
//         </Tabs>
//       </div>
//     );
//   },
// };

// export default CustomElements;

// import React, { useEffect, useState } from "react";
// import { Tabs, Tab } from "@blueprintjs/core";
// import { SectionTab } from "polotno/side-panel";
// import { Shapes } from "lucide-react";
// import { IP } from "../../../utils/Constent";

// const ShapeButton = ({ src, alt, onClick }) => (
//   <div
//     onClick={onClick}
//     style={{
//       width: "80px",
//       height: "80px",
//       display: "flex",
//       alignItems: "center",
//       justifyContent: "center",
//       cursor: "pointer",
//     }}
//   >
//     <img
//       src={src}
//       alt={alt}
//       style={{
//         width: "100%",
//         height: "100%",
//         objectFit: "contain",
//       }}
//     />
//   </div>
// );

// const ShapeGrid = ({ shapes, onAddShape }) => (
//   <div
//     style={{
//       display: "grid",
//       gridTemplateColumns: "repeat(2, 1fr)",
//       gap: "10px",
//       marginTop: "10px",
//     }}
//   >
//     {Object.entries(shapes).map(([name, svg]) => (
//       <ShapeButton
//         key={name}
//         src={svg}
//         alt={name}
//         onClick={() => onAddShape(svg)}
//       />
//     ))}
//   </div>
// );

// const CustomElements = {
//   name: "custom-elements",
//   Tab: (props) => (
//     <SectionTab name="Elements" {...props}>
//       <div className="flex flex-col items-center space-y-1">
//         <Shapes size={20} />
//       </div>
//     </SectionTab>
//   ),
//   Panel: ({ store }) => {
//     const [shapesData, setShapesData] = useState({});
//     const [selectedTab, setSelectedTab] = useState(null);

//     useEffect(() => {
//       const fetchShapes = async () => {
//         try {
//           const res = await fetch(`${IP}/api/v1/admin/shapes`);
//           const data = await res.json();
//           setShapesData(data);
//           const firstCategory = Object.keys(data)[0];
//           setSelectedTab(firstCategory);
//         } catch (error) {
//           console.error("Failed to load shapes:", error);
//         }
//       };
//       fetchShapes();
//     }, []);

//     const addShape = (shapeSvg) => {
//       const page = store.activePage || store.addPage();
//       try {
//         // Use type: "svg" instead of "image"
//         page.addElement({
//           type: "svg",
//           src: shapeSvg,
//           width: 100,
//           height: 100,
//           x: 100,
//           y: 100,
//           resizable: true,
//           lockUniScaling: false, // Allows independent width/height scaling
//           locked: false,
//           keepRatio: false, // Don't force aspect ratio
//         });
//       } catch (error) {
//         console.error("Failed to add shape:", error);
//       }
//     };

//     return (
//       <div style={{ padding: "10px", height: "100%", overflowY: "auto" }}>
//         <h3>Custom Elements</h3>
//         <Tabs
//           id="element-tabs"
//           selectedTabId={selectedTab}
//           onChange={(newTabId) => setSelectedTab(newTabId)}
//           renderActiveTabPanelOnly
//         >
//           {Object.entries(shapesData).map(([category, shapes]) => (
//             <Tab
//               key={category}
//               id={category}
//               title={category.charAt(0).toUpperCase() + category.slice(1)}
//               panel={<ShapeGrid shapes={shapes} onAddShape={addShape} />}
//             />
//           ))}
//         </Tabs>
//       </div>
//     );
//   },
// };

// export default CustomElements;
