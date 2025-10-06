import React, { useState, useEffect } from "react";
import { LayoutAnimation } from "react-native";
import BottomSheet from "./BottomSheet";
import BottomSheetHeader from "./BottomSheetHeader";

type DetailsBottomSheetProps = {
  visible: boolean;
  header: React.ReactNode;     
  children: React.ReactNode;  
};

export default function DetailsBottomSheet({
  visible,
  header,
  children,
}: DetailsBottomSheetProps) {
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (!visible) setExpanded(false);
  }, [visible]);

  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded);
  };

  if (!visible) return null;

  if (!expanded) {
    return (
      <BottomSheetHeader onPress={toggleExpand}>
        {header}
      </BottomSheetHeader>
    );
  }

  return (
    <BottomSheet visible={visible} onClose={toggleExpand}>
      {children}
    </BottomSheet>
  );
}
