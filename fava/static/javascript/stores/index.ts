import { derived, writable, Writable } from "svelte/store";

import {
  object,
  array,
  string,
  boolean,
  number,
  union,
  constant,
} from "../lib/validation";
import { derived_array } from "../lib/store";

export const urlHash = writable("");

export const conversion = writable("");
type Interval = "year" | "quarter" | "month" | "week" | "day";
export const interval: Writable<Interval> = writable("month");

export const favaAPIValidator = object({
  accountURL: string,
  accounts: array(string),
  baseURL: string,
  currencies: array(string),
  documentTitle: string,
  errors: number,
  favaOptions: object({
    "auto-reload": boolean,
    "currency-column": number,
    conversion: string,
    interval: string,
    locale: union(string, constant(null)),
  }),
  have_excel: boolean,
  incognito: boolean,
  links: array(string),
  options: object({
    commodities: array(string),
    documents: array(string),
    operating_currency: array(string),
  }),
  pageTitle: string,
  payees: array(string),
  tags: array(string),
  years: array(string),
});

export type FavaAPI = ReturnType<typeof favaAPIValidator>;
export const favaAPI: FavaAPI = {
  accountURL: "",
  accounts: [],
  baseURL: "",
  currencies: [],
  documentTitle: "",
  errors: 0,
  favaOptions: {
    "auto-reload": false,
    "currency-column": 80,
    conversion: "at_cost",
    interval: "month",
    locale: null,
  },
  have_excel: false,
  incognito: false,
  links: [],
  pageTitle: "",
  payees: [],
  options: {
    commodities: [],
    documents: [],
    operating_currency: [],
  },
  tags: [],
  years: [],
};

export const favaAPIStore = writable(favaAPI);

/** Whether Fava supports exporting to Excel. */
export const HAVE_EXCEL = derived(favaAPIStore, (val) => val.have_excel);
/** The ranked array of all accounts. */
export const accounts = derived_array(favaAPIStore, (val) => val.accounts);
/** The ranked array of all currencies. */
export const currencies = derived_array(favaAPIStore, (val) => val.currencies);
/** The ranked array of all links. */
export const links = derived_array(favaAPIStore, (val) => val.links);
/** The ranked array of all payees. */
export const payees = derived_array(favaAPIStore, (val) => val.payees);
/** The ranked array of all tags. */
export const tags = derived_array(favaAPIStore, (val) => val.tags);
/** The array of all years. */
export const years = derived_array(favaAPIStore, (val) => val.years);

/** The sorted array of operating currencies. */
export const operating_currency = derived_array(favaAPIStore, (val) =>
  val.options.operating_currency.sort()
);

/** The sorted array of all used currencies. */
export const commodities = derived_array(favaAPIStore, (val) =>
  val.options.commodities.sort()
);

/** The number of Beancount errors. */
export const errorCount = writable(0);

favaAPIStore.subscribe((val) => {
  Object.assign(favaAPI, val);
  errorCount.set(favaAPI.errors);
});

export const urlSyncedParams = [
  "account",
  "charts",
  "conversion",
  "filter",
  "interval",
  "time",
];

/** Url for the account page for an account. */
export function accountUrl(account: string): string {
  return new URL(
    favaAPI.accountURL.replace("REPLACEME", account),
    window.location.href
  ).toString();
}

export function closeOverlay(): void {
  if (window.location.hash) {
    window.history.pushState({}, "", "#");
  }
  urlHash.set("");
}
