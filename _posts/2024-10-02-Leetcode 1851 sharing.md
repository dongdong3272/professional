---
title: 'Leetcode 1851 Sharing'
date: 2024-10-02
permalink: /posts/Leetcode 1851 Sharing'
tags:
  - job-seeking
---

# Problem

Please refer to to LeetCode Problem [1851. Minimum Interval to Include Each Query](https://leetcode.com/problems/minimum-interval-to-include-each-query/).

# Solution 1: Naive Method (OT)

    def minInterval(self, intervals: List[List[int]], queries: List[int]) -> List[int]:
	    # sort the intervals
	    intervals.sort(key=lambda x: x[1] - x[0] + 1)
	    ans = []
	    for q in queries:
	        found = False
	        for interval in intervals:
	            # check whether the query is the interval
	            if interval[0] <= q <= interval[1]:
	                ans.append(interval[1] - interval[0] + 1)
	                found = True
	                break
	        if not found:
	            ans.append(-1)
	    return ans


-   **Time Complexity in general:**  
    `O(mn + mlogm)`

-   **Time Complexity when `m = n`:**  
    `O(mn + mlogm) = O(n^2)`

**Limitations:** 
1. O(n^2) time complexity is not practical when n is really large.

# Solution 2: Still Naive Method (OT)

    def minInterval(self, intervals: List[List[int]], queries: List[int]) -> List[int]:
	    lookup = [-1] * (10**7 + 1)
	    # iterate over the intervals and set the lookup list
	    for start, end in intervals:
		    length = end - start + 1
		    for num in range(start, end + 1):
		    if lookup[num] == -1 or lookup[num] > length:
			    lookup[num] = length
		return [lookup[q] for q in queries]

-   **Time Complexity in general:**  
    `O(mk)`

-   **Space Complexity:**  
    `O(k)`
    
**Limitations:** 
1. k can easily be a large number, leading to exploding time and space complexity.

# Solution 3: Binary search in all queries (~2000ms)

	def minInterval(self, intervals: List[List[int]], queries: List[int]) -> List[int]:
		sorted_queries = sorted(enumerate(queries), key = lambda x: x[1])
        intervals.sort(key = lambda x: x[1] - x[0])
        
        # sorted queries: [(0, 2), (2, 5), (1, 19), (3, 22)]
        # sorted intervals: [[2, 3], [2, 5], [20, 25], [1, 8]]
        # then we iterate through each interval: (e.g.)
        # for [2, 5], we hope that returned start_idx = 0 (the first number >= 2)
        # for [2, 5], we hope that returned end_idx = 2 (the first number > 5)
        
        def binarySearchStart(num):
            l, r = 0, len(sorted_queries)
            while l < r:
                mid  = (l + r) // 2
                if sorted_queries[mid][1] >= num:
                    r = mid
                else:
                    l = mid + 1
            return l
                     
        res = [-1] * len(queries)
        for start, end in intervals:
            idx = binarySearchStart(start)
            while idx < len(sorted_queries) and sorted_queries[idx][1] <= end:
                origial_idx = sorted_queries[idx][0]
                res[origial_idx] = end - start + 1
                sorted_queries.pop(idx)
        return res

**Or a simplified version:**

	def minInterval(self, intervals: List[List[int]], queries: List[int]) -> List[int]:
	    intervals.sort(key = lambda x: x[1] - x[0])
	    q = sorted([qu, idx] for idx, qu in enumerate(queries))
	    res = [-1] * len(queries)
    
	    for left, right in intervals:
	        ind = bisect.bisect(q, [left])
	        while ind < len(q) and q[ind][0] <= right:
	            res[q.pop(ind)[1]] = right - left + 1
	    return res

  
-   **Time Complexity in general:**  
    `O(mlogm + nlogn + max(m,n)logn)`
    
-   **Time Complexity when `m = n`:**  
    `O(3nlogn)`

-   **Space Complexity:**  
    `O(n)`

**How to think of the solution:**
In the Solution 2, we use a lookup list to store the answers for all possible queries. But actually, many answers may not be queried so that we waste lots of space storing those values. This solution instead only answers the queries that are being asked.
    
**Limitations:** 
1. Assume that intervals will never change after initial setup.
2. Assume that queries will never change after initial setup.

# Solution 4: Min-heap (~1400ms)

    def minInterval(self, intervals: List[List[int]], queries: List[int]) -> List[int]:
        # sort the intervals by the left
        intervals.sort()
        # print(intervals)
        pq = []
        # pq is a priority queue containing (length of the intervals, start, end)
        # it will pop the intervals that is currently the shortest
        interval_idx = 0
        ans = [-1] * len(queries)
	    for query, query_idx in sorted(zip(queries, range(len(queries)))): 
	        # put the possible answers to the priority queue
	        while interval_idx < len(intervals) and intervals[interval_idx][0] <= query: 
	            heappush(pq, (intervals[interval_idx][1] - intervals[interval_idx][0] + 1, *intervals[interval_idx]))
	            interval_idx += 1
	        
	        # Remove the intervals that end before query
	        while pq and pq[0][2] < query: 
	            heappop(pq)
	        if pq: 
	            ans[query_idx] = pq[0][0]

	    return ans


**Or:**

    def minInterval(self, intervals: List[List[int]], queries: List[int]) -> List[int]:
        intervals.sort(key=lambda x: x[0])
        minHeap = []
        # What's inside the heap
        # (size of the interval, end of the interval)
        # Why we do not care about the start of the interval
        # Because we only push the interval to the heap if the intervals already starts before query,
        # which means that as long as the intervals ends after the query, that interval is a valid interval
	    res = {}
	    i = 0
	    for q in sorted(queries):
	        # push all the intervals that already starts into the heap
	        while i < len(intervals) and intervals[i][0] <= q:
	            l, r = intervals[i]
	            heapq.heappush(minHeap, (r - l + 1, r))
	            i += 1

	        # pop out all the intervals that ends before q
	        while minHeap and minHeap[0][1] < q:
	            heapq.heappop(minHeap)

	        # if there is any interval in the heap, then query is in this interval and the interval is the smallest due to the heap property 
	        res[q] = minHeap[0][0] if minHeap else -1
	        
	    return [res[q] for q in queries]


# Solution 5: Segment Tree (stream algorithm)

    class SegmentTreeNode:
        def __init__(self, left, right):
            self.left = left
            self.right = right
            self.min_size = math.inf
            self.leftNode = None
            self.rightNode = None
    
    class Solution:
        def minInterval(self, intervals: List[List[int]], queries: List[int]) -> List[int]:  
            # first build the segment tree
            root = SegmentTreeNode(1, 10**7)
            
	        def updateTree(node, i_left, i_right):
	            segment_start, segment_end = node.left, node.right
	            # Three cases:
	            # 1. [segment_start, segment_end] does not overlap with [i_left, i_right], then return
	            if segment_start > i_right or segment_end < i_left:
	                return  
	            # 2. [segment_start, segment_end] is in [i_left, i_right], then simply update the segment
	            if segment_start >= i_left and segment_end <= i_right:
	                node.min_size = min(node.min_size, i_right - i_left + 1)
	                return
	            # 3. [segment_start, segment_end] partially overlap with [i_left, i_right], then we need to go to both children
	            segment_mid = segment_start + (segment_end - segment_start) // 2
	            if node.leftNode is None:
	                node.leftNode = SegmentTreeNode(segment_start, segment_mid)
	            updateTree(node.leftNode, i_left, i_right)
	            if node.rightNode is None:
	                node.rightNode = SegmentTreeNode(segment_mid + 1, segment_end)
	            updateTree(node.rightNode, i_left, i_right)

	        for start, end in intervals:
	            updateTree(root, start, end)
	        
	        # Now the tree has been built
	        # do the query
	        def searchTreeNode(node, query):
	            if node is None:
	                return math.inf
	            # if the query is not in the segment:
	            segment_start, segment_end = node.left, node.right
	            if query < segment_start or segment_end < query:
	                return math.inf
	            # otherwise check which part it should belong to
	            segment_mid = segment_start + (segment_end - segment_start) // 2
	            if query <= segment_mid:
	                return min(node.min_size, searchTreeNode(node.leftNode, query))
	            else:
	                return min(node.min_size, searchTreeNode(node.rightNode, query))

	        def queryTree(query):
	            ans = searchTreeNode(root, query)
	            return ans if ans != math.inf else -1 

	        res = []
	        for query in queries:
	            res.append(queryTree(query))
	        return res
