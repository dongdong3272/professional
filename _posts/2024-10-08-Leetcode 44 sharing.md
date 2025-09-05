---
title: 'Leetcode 44 Sharing'
date: 2024-10-02
permalink: /posts/Leetcode 44 Sharing'
tags:
  - job-seeking
---

# Problem

Please refer to to LeetCode Problem [44. Wildcard Matching](https://leetcode.com/problems/wildcard-matching/).


# Solution 1: Double DP

    def isMatch(self, s: str, p: str) -> bool:
        m, n = len(s), len(p)
        ans = [[False for _ in range(n+1)] for _ in range(m+1)]
        # ans is a matrix of size (m+1) by (n+1), and ans[i][j] represents whether s[i:] matches p[j:]

        # Base cases (the last row and last column):
        # 1. ans[m][n] = True (both empty)
        ans[m][n] = True
        # 2. ans[0:m][n] = False (pattern is empty & string is non-empty)
        for i in range(0, m):
            ans[i][n] = False
        # 3. ans[m][0:n] = True/False depends on whether patterns are full of *
        for j in range(n-1, -1, -1):
            ans[m][j] = ans[m][j+1] and p[j] == "*" 

        for j in range(n-1, -1, -1):
            for i in range(m-1, -1, -1):
                # depending on the first pattern character, there are three cases:
                # case 1: p[j] is "?"
                if p[j] == "?":
                    ans[i][j] = ans[i+1][j+1]
                # case 2: p[j] is "*"
                elif p[j] == "*":
                    # advance to the next char in string or omit this *
                    ans[i][j] = ans[i+1][j] or ans[i][j+1]
                # case 3: p[j] is a specific char
                else:
                    ans[i][j] = (s[i] == p[j]) and ans[i+1][j+1]
   
        return ans[0][0]


# Solution 2: Iteration with Cache

    def isMatch(self, s: str, p: str) -> bool:
        m, n = len(s), len(p)
        cache = [[None for _ in range(n+1)] for _ in range(m+1)]

        def iterate(s_idx, p_idx):
            # base cases:
            if cache[s_idx][p_idx] is not None:
                return cache[s_idx][p_idx]
            
            if s_idx == m and p_idx == n:
                cache[s_idx][p_idx] = True
            elif p_idx == n:
                cache[s_idx][p_idx] = False
            elif s_idx == m:
                cache[s_idx][p_idx] = p[p_idx:] == "*" * (n - p_idx)
            elif p[p_idx] == "?":
                cache[s_idx][p_idx] = iterate(s_idx + 1, p_idx + 1)
            elif p[p_idx] == "*":
                # Avoid redundant recursive calls with this optimization
                cache[s_idx][p_idx] = iterate(s_idx + 1, p_idx) or iterate(s_idx, p_idx + 1)
            else:
                cache[s_idx][p_idx] = s[s_idx] == p[p_idx] and iterate(s_idx + 1, p_idx + 1)
            
            return cache[s_idx][p_idx]

        return iterate(0, 0)
