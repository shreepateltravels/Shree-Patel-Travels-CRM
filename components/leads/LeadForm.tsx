"use client";

import { useState, useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { createLead } from "@/lib/actions/lead.actions";
import {
  Loader2,
  MapPin,
  Plus,
  ArrowRightLeft,
  CheckCircle2,
  User,
  Phone,
  Calendar,
} from "lucide-react";

interface City {
  id: string;
  name: string;
}

// --- SMART CITY SELECTOR ---
function CitySelector({
  label,
  name,
  cities,
  onAddCity,
  selectedCity,
  onSelect,
  alignMenu = "left",
}: {
  label: string;
  name: string;
  cities: City[];
  onAddCity: (name: string) => Promise<City | null>;
  selectedCity: City | null;
  onSelect: (city: City | null) => void;
  alignMenu?: "left" | "right";
}) {
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSearch(selectedCity ? selectedCity.name : "");
  }, [selectedCity]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearch(selectedCity ? selectedCity.name : "");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [selectedCity]);

  const filteredCities = cities.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()),
  );

  const hasExactMatch = cities.some(
    (c) => c.name.toLowerCase() === search.trim().toLowerCase(),
  );

  const handleSelect = (city: City) => {
    onSelect(city);
    setIsOpen(false);
  };

  const handleAddNew = async () => {
    if (!search.trim()) return;
    setIsAdding(true);
    const newCity = await onAddCity(search.trim());
    if (newCity) {
      onSelect(newCity);
      setIsOpen(false);
    }
    setIsAdding(false);
  };

  return (
    <div ref={wrapperRef} className="relative w-full">
      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
        {label} *
      </label>
      <input type="hidden" name={name} value={selectedCity?.id || ""} />
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          className="input-primary pl-9 bg-white text-sm py-2.5"
          placeholder="Select City"
          value={search}
          autoComplete="off"
          onChange={(e) => {
            setSearch(e.target.value);
            onSelect(null);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
        />
      </div>

      {isOpen && (
        <div
          className={`absolute z-50 mt-1 w-[240px] bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 ${alignMenu === "right" ? "right-0" : "left-0"}`}
        >
          <div className="max-h-48 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {filteredCities.map((city) => (
              <button
                key={city.id}
                type="button"
                onClick={() => handleSelect(city)}
                className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
              >
                {city.name}
              </button>
            ))}
          </div>
          {!hasExactMatch && search.trim() !== "" && (
            <div className="p-2 bg-slate-50 border-t border-slate-100">
              <button
                type="button"
                onClick={handleAddNew}
                disabled={isAdding}
                className="w-full flex items-center justify-center gap-2 py-2 text-sm font-medium text-[#3da9d4] bg-[#3da9d4]/10 hover:bg-[#3da9d4]/20 rounded-lg transition-colors"
              >
                {isAdding ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Plus className="w-4 h-4" />
                )}
                Add "{search}"
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function LeadForm() {
  const supabase = createClient();
  const [cities, setCities] = useState<City[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const [mobileNumber, setMobileNumber] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerSuggestions, setCustomerSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchWrapperRef = useRef<HTMLDivElement>(null);

  const [leadType, setLeadType] = useState<"Ticket" | "Parcel">("Ticket");
  const [fromCity, setFromCity] = useState<City | null>(null);
  const [toCity, setToCity] = useState<City | null>(null);

  const todayStr = new Date().toISOString().split("T")[0];

  useEffect(() => {
    fetchCities();
  }, []);

  useEffect(() => {
    async function searchCustomers() {
      if (mobileNumber.length >= 3) {
        const { data } = await supabase
          .from("customers")
          .select("name, mobile_number")
          .ilike("mobile_number", `%${mobileNumber}%`)
          .limit(5);

        if (data && data.length > 0) {
          setCustomerSuggestions(data);
          setShowSuggestions(true);
        } else {
          setCustomerSuggestions([]);
          setShowSuggestions(false);
        }
      } else {
        setCustomerSuggestions([]);
        setShowSuggestions(false);
      }
    }

    const debounceTimer = setTimeout(searchCustomers, 300);
    return () => clearTimeout(debounceTimer);
  }, [mobileNumber]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchWrapperRef.current &&
        !searchWrapperRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectCustomer = (customer: any) => {
    const rawNumber = customer.mobile_number
      ? customer.mobile_number.replace("+91 ", "")
      : "";
    setMobileNumber(rawNumber);
    setCustomerName(customer.name || "");
    setShowSuggestions(false);
  };

  async function fetchCities() {
    const { data } = await supabase.from("cities").select("*").order("name");
    if (data) setCities(data);
  }

  async function handleAddCity(cityName: string): Promise<City | null> {
    const { data, error } = await supabase
      .from("cities")
      .insert([{ name: cityName }])
      .select()
      .single();
    if (!error && data) {
      setCities((prev) =>
        [...prev, data].sort((a, b) => a.name.localeCompare(b.name)),
      );
      return data;
    }
    return null;
  }

  const handleSwapCities = () => {
    const temp = fromCity;
    setFromCity(toCity);
    setToCity(temp);
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setShowSuccess(false);

    const formElement = e.currentTarget;
    const formData = new FormData(formElement);
    const fromCityId = formData.get("from_city_id") as string;
    const toCityId = formData.get("to_city_id") as string;

    if (!fromCityId || !toCityId) {
      alert("Please select a valid From and To city.");
      setIsSubmitting(false);
      return;
    }

    try {
      await createLead({
        customer_name: customerName,
        mobile_number: `+91 ${mobileNumber}`,
        from_city_id: fromCityId,
        to_city_id: toCityId,
        journey_date: formData.get("journey_date") as string,
        type: leadType,
        status: "New",
        number_of_seats:
          leadType === "Ticket"
            ? Number(formData.get("number_of_seats"))
            : null,
        parcel_weight:
          leadType === "Parcel" ? Number(formData.get("parcel_weight")) : null,
        notes: formData.get("notes") as string,
      });

      formElement.reset();
      setMobileNumber("");
      setCustomerName("");
      setFromCity(null);
      setToCity(null);
      setLeadType("Ticket");

      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error(error);
      alert("Failed to add lead.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    // FIX: Removed `h-full`. Added `h-fit` so the white card gracefully hugs its content!
    <div className="saas-card bg-white p-5 flex flex-col border-t-4 border-t-[#3da9d4] shadow-sm relative overflow-hidden h-fit max-h-full">
      <div className="mb-4 shrink-0">
        <h2 className="text-lg font-bold text-slate-800">New Inquiry</h2>
        <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
          Log a new call or message
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col min-h-0">
        {/* FIX: Removed `flex-1` from here, removed `pb-28` so it packs tightly together. */}
        <div className="flex flex-col gap-5 overflow-y-auto pr-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {/* Customer Details */}
          <div className="space-y-4">
            <div ref={searchWrapperRef} className="relative z-40">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                Mobile Number *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none border-r border-slate-100 mr-2">
                  <span className="text-slate-500 text-sm font-bold">+91</span>
                </div>
                <input
                  required
                  type="tel"
                  value={mobileNumber}
                  onChange={(e) => {
                    setMobileNumber(e.target.value);
                    setShowSuggestions(true);
                  }}
                  maxLength={10}
                  autoComplete="off"
                  className="input-primary pl-12 font-bold text-sm py-2.5 w-full tracking-wider"
                  placeholder="12345 67890"
                />
              </div>

              {showSuggestions && customerSuggestions.length > 0 && (
                <div className="absolute z-50 mt-1 w-full bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden animate-in slide-in-from-top-1">
                  <div className="max-h-48 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                    {customerSuggestions.map((cust, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSelectCustomer(cust)}
                        className="w-full text-left px-4 py-3 text-sm flex items-center justify-between hover:bg-slate-50 border-b border-slate-50 last:border-0 transition-colors"
                      >
                        <span className="font-bold text-slate-800">
                          {cust.name || "Unknown"}
                        </span>
                        <span className="text-slate-500 font-medium text-xs">
                          {cust.mobile_number}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                Customer Name *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  required
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="input-primary w-full text-sm py-2.5 pl-10"
                  placeholder="Full Name"
                />
              </div>
            </div>
          </div>

          <div className="h-px bg-slate-100 my-1 shrink-0" />

          {/* Route Details */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <CitySelector
                label="From"
                name="from_city_id"
                cities={cities}
                onAddCity={handleAddCity}
                selectedCity={fromCity}
                onSelect={setFromCity}
                alignMenu="left"
              />
              <button
                type="button"
                onClick={handleSwapCities}
                className="mt-7 p-2 rounded-full bg-slate-50 hover:bg-[#3da9d4]/10 text-slate-400 hover:text-[#3da9d4] transition-colors shrink-0 border border-slate-200"
              >
                <ArrowRightLeft className="w-4 h-4" />
              </button>
              <CitySelector
                label="To"
                name="to_city_id"
                cities={cities}
                onAddCity={handleAddCity}
                selectedCity={toCity}
                onSelect={setToCity}
                alignMenu="right"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                Journey Date *
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  required
                  type="date"
                  name="journey_date"
                  min={todayStr}
                  className="input-primary w-full text-sm py-2.5 pl-10"
                />
              </div>
            </div>
          </div>

          {/* Inquiry Type */}
          <div className="space-y-4 pt-1">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">
                Inquiry Type *
              </label>
              <div className="flex rounded-lg border border-slate-200 p-1 bg-slate-50">
                <button
                  type="button"
                  onClick={() => setLeadType("Ticket")}
                  className={`flex-1 py-2 text-xs font-bold rounded-md transition-all ${leadType === "Ticket" ? "bg-white text-[#3da9d4] shadow-sm border border-slate-100" : "text-slate-500"}`}
                >
                  Bus Ticket
                </button>
                <button
                  type="button"
                  onClick={() => setLeadType("Parcel")}
                  className={`flex-1 py-2 text-xs font-bold rounded-md transition-all ${leadType === "Parcel" ? "bg-white text-[#3da9d4] shadow-sm border border-slate-100" : "text-slate-500"}`}
                >
                  Parcel Transport
                </button>
              </div>
            </div>

            <div>
              {leadType === "Ticket" ? (
                <div className="animate-in fade-in slide-in-from-left-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                    Seats Required *
                  </label>
                  <input
                    required
                    type="number"
                    min="1"
                    name="number_of_seats"
                    className="input-primary w-full text-sm py-2.5"
                    placeholder="Quantity"
                  />
                </div>
              ) : (
                <div className="animate-in fade-in slide-in-from-right-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                    Weight (kg) *
                  </label>
                  <input
                    required
                    type="number"
                    min="1"
                    name="parcel_weight"
                    className="input-primary w-full text-sm py-2.5"
                    placeholder="e.g. 15"
                  />
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                Notes (Optional)
              </label>
              <textarea
                name="notes"
                rows={2}
                className="input-primary resize-none w-full text-sm py-2"
                placeholder="Any special requests..."
              />
            </div>
          </div>
        </div>

        {/* FIX: Set to natural flow using mt-4 pt-4 border-t instead of 'absolute'. */}
        <div className="mt-4 pt-4 shrink-0 flex flex-col gap-3 bg-white border-t border-slate-100">
          {showSuccess && (
            <div className="flex items-center justify-center gap-2 text-xs font-bold text-emerald-600 uppercase bg-emerald-50 py-2 rounded-lg border border-emerald-100 animate-in zoom-in-95">
              <CheckCircle2 className="w-4 h-4" /> Lead saved successfully!
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-brand w-full flex items-center justify-center gap-2 py-3.5 text-sm font-bold shadow-xl active:scale-95 transition-transform"
          >
            {isSubmitting ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                {" "}
                <CheckCircle2 className="w-4 h-4" /> Save Lead Enquiry{" "}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
