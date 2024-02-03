#!/usr/bin/env python3
"""A BasicCache that inherits from
BaseCaching and is a caching system:
"""


BaseCaching = __import__('base_caching').BaseCaching


class BasicCache(BaseCaching):
    """A basic caching system"""

    def __init__(self):
        """Initialize the BasicCache"""
        super().__init__()

    def put(self, key, item):
        """Store an item in the cache"""
        if key is None or item is None:
            return
        self.cache_data[key] = item

    def get(self, key):
        """Retrieve an item from the cache"""
        if key is None or key not in self.cache_data.keys():
            return None
        return self.cache_data.get(key)
    """_summary_
    """

    def __init__(self):
        """_summary_
        """
        super().__init__()

    def put(self, key, item):
        """_summary_

        Args:
                key (_type_): _description_
                item (_type_): _description_
        """
        if key is None or item is None:
            pass
        else:
            self.cache_data[key] = item

    def get(self, key):
        """return the value in self.cache_data linked to key

        Args:
                key (_type_): _description_
        """
        if key is None or key not in self.cache_data.keys():
            return None
        return self.cache_data.get(key)
