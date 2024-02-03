
#!/usr/bin/env python3
"""A LIFOCACHE that inherits from
BaseCaching and is a caching system:
"""


BaseCaching = __import__('base_caching').BaseCaching


class LIFOCache(BaseCaching):
    """A Last-In, First-Out (LIFO) caching system"""

    def __init__(self):
        """Initialize the LIFOCache"""
        super().__init__()

    def put(self, key, item):
        """Store an item in the cache

        Args:
            key: The key to store the item under
            item: The item to be stored
        """
        if key is None or item is None:
            return
        if len(
                self.cache_data) >= BaseCaching.MAX_ITEMS and key not in self.cache_data:
            # Delete the last item in the dictionary
            last_key, last_value = self.cache_data.popitem()
            print("DISCARD: {}".format(last_key))
        self.cache_data[key] = item

    def get(self, key):
        """Retrieve an item from the cache

        Args:
            key: The key of the item to retrieve

        Returns:
            The item associated with the key, or None if not found
        """
        if key is None or key not in self.cache_data:
            return None
        return self.cache_data[key]
