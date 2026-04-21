/* ─── Checkout ─────────────────────────────────────── */
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { City, State } from 'country-state-city';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import './Checkout.css';

const INDIA_COUNTRY_CODE = 'IN';

const createEmptyAddress = (name = '') => ({
  fullName: name,
  phone: '',
  line1: '',
  line2: '',
  city: '',
  state: '',
  pincode: '',
  isDefault: false,
});

const normalize = (value) => (value || '').toString().trim().toLowerCase();

const isSameAddress = (a, b) => {
  const fields = ['fullName', 'phone', 'line1', 'line2', 'city', 'state', 'pincode'];
  return fields.every((field) => normalize(a?.[field]) === normalize(b?.[field]));
};

export default function Checkout() {
  const { cart } = useCart();
  const { customer } = useAuth();
  const navigate = useNavigate();
  const items = cart.items || [];

  const indiaStates = useMemo(
    () => State.getStatesOfCountry(INDIA_COUNTRY_CODE).sort((a, b) => a.name.localeCompare(b.name)),
    []
  );

  const [mode, setMode] = useState('new');
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [address, setAddress] = useState(createEmptyAddress(customer?.name || ''));
  const [saveForFuture, setSaveForFuture] = useState(true);
  const [selectedStateCode, setSelectedStateCode] = useState('');
  const [errors, setErrors] = useState({});

  const subtotal = items.reduce((s, i) => s + (i.product?.price || 0) * (i.quantity || 1), 0);
  const shipping = 1;
  const total = subtotal + shipping;

  const cityOptions = useMemo(() => {
    if (!selectedStateCode) return [];
    return City.getCitiesOfState(INDIA_COUNTRY_CODE, selectedStateCode).sort((a, b) => a.name.localeCompare(b.name));
  }, [selectedStateCode]);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get('/api/users/profile');
        const addresses = data.addresses || [];
        setSavedAddresses(addresses);

        if (addresses.length > 0) {
          const preferredAddress = addresses.find((addr) => addr.isDefault) || addresses[0];
          setSelectedAddressId(preferredAddress._id);
          setMode('select');

          const stateInfo = indiaStates.find((s) => s.name === preferredAddress.state);
          setSelectedStateCode(stateInfo?.isoCode || '');
        } else {
          setMode('new');
        }

        setAddress((current) => ({
          ...current,
          fullName: data.name || current.fullName,
        }));
      } catch (err) {
        console.error('Failed to load addresses');
      }
    })();
  }, [indiaStates]);

  const handleStateChange = (code) => {
    const stateInfo = indiaStates.find((state) => state.isoCode === code);
    setSelectedStateCode(code);
    setAddress((a) => ({ ...a, state: stateInfo?.name || '', city: '' }));
  };

  const validate = () => {
    const e = {};
    if (!address.fullName.trim()) e.fullName = 'Name required';
    if (!/^\d{10}$/.test(address.phone.trim())) e.phone = 'Enter 10-digit phone number';
    if (!address.line1.trim()) e.line1 = 'Address required';
    if (!address.city.trim()) e.city = 'City required';
    if (!address.state.trim()) e.state = 'State required';
    if (!/^\d{6}$/.test(address.pincode.trim())) e.pincode = 'Enter valid 6-digit pincode';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const persistCheckoutAddress = (addr) => {
    sessionStorage.setItem('checkoutAddress', JSON.stringify(addr));
    navigate('/payment');
  };

  const proceedWithNewAddress = async () => {
    if (!validate()) return;

    const payload = {
      ...address,
      fullName: address.fullName.trim(),
      phone: address.phone.trim(),
      line1: address.line1.trim(),
      line2: address.line2.trim(),
      city: address.city.trim(),
      state: address.state.trim(),
      pincode: address.pincode.trim(),
    };

    try {
      if (!saveForFuture) {
        persistCheckoutAddress(payload);
        return;
      }

      const existingAddress = savedAddresses.find((addr) => isSameAddress(addr, payload));
      if (existingAddress) {
        persistCheckoutAddress(existingAddress);
        return;
      }

      const { data } = await api.post('/api/users/addresses', payload);
      const latestAddresses = Array.isArray(data) ? data : [];
      const saved = latestAddresses.find((addr) => isSameAddress(addr, payload)) || payload;
      setSavedAddresses(latestAddresses);
      persistCheckoutAddress(saved);
    } catch (err) {
      console.error('Failed to save address:', err);
      alert('Failed to save address. Please try again.');
    }
  };

  const proceedWithSavedAddress = () => {
    const selected = savedAddresses.find((addr) => addr._id === selectedAddressId);
    if (!selected) return;
    persistCheckoutAddress(selected);
  };

  if (items.length === 0) { navigate('/cart'); return null; }

  return (
    <div className="checkout-page">
      <h1>Secure Checkout</h1>
      <p className="checkout-subtitle">Choose a saved address or add a new one for delivery.</p>

      <div className="checkout-layout">
        <div className="checkout-form">
          <h3>Shipping Address</h3>

          {mode === 'select' && savedAddresses.length > 0 && (
            <div className="saved-addresses">
              <h4>Your Saved Addresses</h4>
              {savedAddresses.map((addr) => (
                <label
                  key={addr._id}
                  className={`saved-addr-card ${selectedAddressId === addr._id ? 'selected' : ''}`}
                  htmlFor={`addr-${addr._id}`}
                >
                  <input
                    id={`addr-${addr._id}`}
                    type="radio"
                    name="address"
                    checked={selectedAddressId === addr._id}
                    onChange={() => setSelectedAddressId(addr._id)}
                  />
                  <div className="addr-details">
                    <p><strong>{addr.fullName}</strong> - {addr.phone}</p>
                    <p>{addr.line1}{addr.line2 ? `, ${addr.line2}` : ''}</p>
                    <p>{addr.city}, {addr.state} {addr.pincode}</p>
                    {addr.isDefault && <span className="default-badge">Default</span>}
                  </div>
                </label>
              ))}
              <button type="button" className="add-address-link" onClick={() => setMode('new')}>
                + New Address
              </button>
              <button type="button" className="btn btn-primary btn-full" onClick={proceedWithSavedAddress} disabled={!selectedAddressId}>
                Deliver To Selected Address
              </button>
            </div>
          )}

          {(mode === 'new' || savedAddresses.length === 0) && (
            <>
              <div className="form-grid">
                <div className="form-group">
                  <label>Full Name</label>
                  <input type="text" value={address.fullName} onChange={e => setAddress(a => ({ ...a, fullName: e.target.value }))} className={errors.fullName ? 'error' : ''} />
                  {errors.fullName && <span className="form-error">{errors.fullName}</span>}
                </div>

                <div className="form-group">
                  <label>Phone Number</label>
                  <input type="tel" maxLength="10" value={address.phone} onChange={e => setAddress(a => ({ ...a, phone: e.target.value.replace(/\D/g, '') }))} className={errors.phone ? 'error' : ''} />
                  {errors.phone && <span className="form-error">{errors.phone}</span>}
                </div>
              </div>

              <div className="form-group">
                <label>Address Line 1</label>
                <input type="text" value={address.line1} onChange={e => setAddress(a => ({ ...a, line1: e.target.value }))} className={errors.line1 ? 'error' : ''} />
                {errors.line1 && <span className="form-error">{errors.line1}</span>}
              </div>

              <div className="form-group">
                <label>Address Line 2 (Optional)</label>
                <input type="text" value={address.line2} onChange={e => setAddress(a => ({ ...a, line2: e.target.value }))} />
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label>State</label>
                  <select value={selectedStateCode} onChange={e => handleStateChange(e.target.value)} className={errors.state ? 'error' : ''}>
                    <option value="">Select State</option>
                    {indiaStates.map((state) => (
                      <option key={state.isoCode} value={state.isoCode}>{state.name}</option>
                    ))}
                  </select>
                  {errors.state && <span className="form-error">{errors.state}</span>}
                </div>

                <div className="form-group">
                  <label>City</label>
                  <select value={address.city} onChange={e => setAddress(a => ({ ...a, city: e.target.value }))} className={errors.city ? 'error' : ''} disabled={!selectedStateCode}>
                    <option value="">Select City</option>
                    {cityOptions.map((city) => (
                      <option key={`${city.name}-${city.stateCode}`} value={city.name}>{city.name}</option>
                    ))}
                  </select>
                  {errors.city && <span className="form-error">{errors.city}</span>}
                </div>
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label>PIN Code</label>
                  <input type="text" maxLength="6" value={address.pincode} onChange={e => setAddress(a => ({ ...a, pincode: e.target.value.replace(/\D/g, '') }))} className={errors.pincode ? 'error' : ''} />
                  {errors.pincode && <span className="form-error">{errors.pincode}</span>}
                </div>

                <div className="form-group checkbox inline-checkbox">
                  <input type="checkbox" checked={address.isDefault} onChange={e => setAddress(a => ({ ...a, isDefault: e.target.checked }))} />
                  <label>Set as default</label>
                </div>
              </div>

              <div className="form-group checkbox">
                <input type="checkbox" checked={saveForFuture} onChange={e => setSaveForFuture(e.target.checked)} />
                <label>Save this address for future orders</label>
              </div>

              {savedAddresses.length > 0 && (
                <button type="button" className="add-address-link" onClick={() => setMode('select')}>
                  Use Saved Address
                </button>
              )}

              <button className="btn btn-primary btn-full" onClick={proceedWithNewAddress}>Continue to Payment</button>
            </>
          )}
        </div>

        <div className="checkout-summary">
          <h3>Order Summary</h3>
          {items.map((item, i) => {
            const p = item.product || {};
            return (
              <div className="cos-item" key={i}>
                <img src={p.images?.[0] || 'https://via.placeholder.com/60'} alt={p.name} />
                <div>
                  <p className="cos-name">{p.name}</p>
                  <p className="cos-qty">Qty: {item.quantity}</p>
                </div>
                <span className="cos-price">₹{(p.price * item.quantity).toLocaleString()}</span>
              </div>
            );
          })}
          <hr />
          <div className="cs-row"><span>Subtotal</span><span>₹{subtotal.toLocaleString()}</span></div>
          <div className="cs-row"><span>Shipping</span><span>{shipping === 0 ? 'Free' : `₹${shipping}`}</span></div>
          <div className="cs-row cs-total"><span>Total</span><span>₹{total.toLocaleString()}</span></div>
        </div>
      </div>
    </div>
  );
}
