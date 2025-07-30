export interface RawAddress {
    address: string;
    address1: string;
    address2: string;
    address3: string;
    address4: string;
    address5: string;
    city: string;
    region: string;
    country: string;
    postcode: string;
    address_id: string;
  }
  
  export interface FormattedAddress {
    id: number;
    label: string;
    lines: string;
    address_id: string;
  } 