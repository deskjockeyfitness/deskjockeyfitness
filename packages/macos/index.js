import { AppRegistry } from "react-native";
import { App } from "@deskjockeyfitness/app";
import { name as appName } from "./app.json";

/* URL polyfill. Required for Supabase queries to work in React Native. */
import 'react-native-url-polyfill/auto'

AppRegistry.registerComponent(appName, () => App);
