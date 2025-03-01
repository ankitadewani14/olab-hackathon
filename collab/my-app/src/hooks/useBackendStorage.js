import { useEffect, useState } from 'react';
import axios from 'axios';

export default function useBackendStorage(key, initialValue, token) {
  const [value, setValue] = useState(initialValue);

  // Fetch stored value from the backend when the key changes
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post('http://localhost:5000/api/fetch', { token, key });
        if (response.data && response.data.value != null) {
          setValue(response.data.value); // Update the state with the fetched value
        }
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };

    fetchData();
  }, [key, token]);

  // Save updated value to the backend whenever the value changes
  useEffect(() => {
    const saveData = async () => {
      try {
        await axios.post('http://localhost:5000/api/save', { token, key, value });
      } catch (err) {
        console.error('Error saving data:', err);
      }
    };

    if (value !== initialValue) saveData();
  }, [key, value, token, initialValue]);

  return [value, setValue];
}
