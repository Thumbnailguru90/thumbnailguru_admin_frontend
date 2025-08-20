import React, { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { SectionTab } from "polotno/side-panel";
import { TextPanel } from "polotno/side-panel/text-panel";
import { FaFont, FaTextHeight } from "react-icons/fa";
import { setGoogleFonts, addGlobalFont } from "polotno/config";
import { Tabs, Tab } from "@blueprintjs/core";

// Custom Fonts Tab Component
const FontsTab = observer(({ store }) => {
  const [fonts, setFonts] = useState([]);
  const [selectedFont, setSelectedFont] = useState(null);

  useEffect(() => {
    const fetchFonts = async () => {
      try {
        const res = await fetch(`${IP}/api/v1/fonts`);
        const fontData = await res.json();
        setFonts(fontData);

        // Register all fonts globally
        fontData.forEach((font) => {
          addGlobalFont({
            fontFamily: font.family,
            styles: [
              {
                src: `url(${font.url})`,
                fontStyle: font.style,
                fontWeight: font.weight,
              },
            ],
          });
        });
      } catch (err) {
        console.error("Failed to load fonts:", err);
      }
    };

    fetchFonts();
  }, []);

  const applyFont = (fontFamily) => {
    const element = store.selectedElements[0];
    if (element && element.type === "text") {
      element.set({ fontFamily });
    }
  };

  return (
    <div className="polotno-side-panel-fonts">
      <div className="polotno-side-panel-fonts-list">
        {fonts.map((font) => (
          <div
            key={font.family}
            className={`polotno-side-panel-font-item ${
              selectedFont === font.family ? "active" : ""
            }`}
            onClick={() => {
              setSelectedFont(font.family);
              applyFont(font.family);
            }}
            style={{ fontFamily: font.family }}
          >
            {font.family}
          </div>
        ))}
      </div>
    </div>
  );
});

// Custom Text Panel with Tabs
const CustomTextPanel = observer(({ store }) => {
  const [activeTab, setActiveTab] = useState("text");

  return (
    <div className="polotno-side-panel-text-container">
      <Tabs
        id="text-panel-tabs"
        selectedTabId={activeTab}
        onChange={(tabId) => setActiveTab(tabId)}
      >
        <Tab
          id="text"
          title={
            <div className="polotno-side-panel-tab-title">
              <FaTextHeight /> Text
            </div>
          }
          panel={
            <TextPanel
              store={store}
              customFonts={fonts.map((f) => f.family)}
              availableFonts={fonts.map((f) => f.family)}
            />
          }
        />
        <Tab
          id="fonts"
          title={
            <div className="polotno-side-panel-tab-title">
              <FaFont /> Fonts
            </div>
          }
          panel={<FontsTab store={store} />}
        />
      </Tabs>
    </div>
  );
});

// Section Export
export const TextSection = {
  name: "text",
  Tab: (props) => (
    <SectionTab name="Text" {...props}>
      <FaFont />
    </SectionTab>
  ),
  Panel: CustomTextPanel,
};
