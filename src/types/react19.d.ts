import React from "react";

declare global {
  namespace JSX {
    type Element = React.ReactElement<any, any>;
    interface ElementAttributesProperty {
      props: object;
    }
    interface ElementChildrenAttribute {
      children: object;
    }
    // interface IntrinsicElements extends React.JSX.IntrinsicElements {} // REMOVE THIS LINE
  }
}

export {};
