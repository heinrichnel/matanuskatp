/**
 * React 19 JSX type definitions
 * These type definitions help TypeScript understand the new React 19 JSX structure
 */

import React from "react";

declare global {
  namespace JSX {
    interface Element extends React.ReactElement<any, any> {}
    interface ElementAttributesProperty {
      props: {};
    }
    interface ElementChildrenAttribute {
      children: {};
    }
    interface IntrinsicElements extends React.JSX.IntrinsicElements {}
  }
}

export {};
