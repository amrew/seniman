import { _createBlock, _createComponent, useWindow, useClient, useStream, createCollection, createHandler, createChannel, createRef, Sequence } from './window.js';
import { createModule } from './module.js';
import { useState, useMemo, onCleanup, onDispose, useEffect, useDisposableEffect, untrack, createContext, useContext, useCallback, runInNode, getActiveNode, onError, wrapPromise } from './state.js';
import { _declareBlock, _declareClientFunction } from './declare.js';
import { MAX_INPUT_EVENT_BUFFER_SIZE } from './config.js';

function withValue(fn) {
  let handler;

  if (typeof fn === 'function') {
    handler = createHandler(fn);
  } else {
    // if not function, assume it is already a handler
    handler = fn;
  }

  return $c((e) => $s(handler)(e.target.value));
}

function preventDefault(fn) {
  let handler;

  if (typeof fn === 'function') {
    handler = createHandler(fn);
  } else {
    // if not function, assume it is already a handler
    handler = fn;
  }

  return $c((e) => {
    e.preventDefault();
    $s(handler)();
  });
}

function Anchor(props) {
  let client = useClient();

  return <a
    href={props.href}
    style={props.style}
    class={props.style}
    onClick={preventDefault(() => {
      if (props.onClick) {
        props.onClick(props.href);
      } else {
        client.navigate(props.href);
      }
    })}>{props.children}</a>;
}

export {
  useState,
  useMemo,
  useEffect,
  useDisposableEffect,
  useWindow,
  useClient,
  useStream,
  createHandler,
  createCollection,
  createChannel,
  createRef,
  createModule,
  Sequence,

  createContext,
  useContext,
  useCallback,
  runInNode,
  getActiveNode,
  wrapPromise,

  withValue,
  preventDefault,
  Anchor,

  onError,
  onCleanup,
  onDispose,
  untrack,

  _declareBlock,
  _declareClientFunction,
  _createBlock,
  _createComponent,

  MAX_INPUT_EVENT_BUFFER_SIZE
};