
#!/usr/bin/env python3
"""A MRUCACHE that inherits from
BaseCaching and is a caching system:
"""


BaseCaching = __import__('base_caching').BaseCaching


class MRUCache(BaseCaching):
    """A Most Recently Used (MRU) caching system"""

    def __init__(self):
        """Initialize the MRUCache"""
        super().__init__()
        self.used_keys = []

    def put(self, key, item):
        """Store an item in the cache

        Args:
            key: The key to store the item under
            item: The item to be stored
        """
        if key is not None and item is not None:
            self.cache_data[key] = item
            if key in self.used_keys:
                self.used_keys.remove(key)
            self.used_keys.append(key)
            if len(self.used_keys) > BaseCaching.MAX_ITEMS:
                discarded_key = self.used_keys.pop(0)
                del self.cache_data[discarded_key]
                print('DISCARD: {:s}'.format(discarded_key))

    def get(self, key):
        """Retrieve an item from the cache

        Args:
            key: The key of the item to retrieve

        Returns:
            The item associated with the key, or None if not found
        """
        if key is not None and key in self.cache_data:
            self.used_keys.remove(key)
            self.used_keys.append(key)
            return self.cache_data.get(key)
        return None
