---
name: unit test
description: Use this skill when writing unit tests
---

# My Skill

Writting unit tests

## When to Use

- Use this skill when writing unit tests

## Instructions

- Example for a positive test
```
import { describe, it, expect } from 'vitest'
import { getTotalPages, getPageSlice, PAGE_SIZE } from './pagination'

const ten = Array.from({ length: 10 }, (_, i) => ({
  id: `id-${i}`,
  name: `Name ${i}`,
  imageUrl: 'https://example.com/x.png',
}))

it('getTotalPages(20, 10) is 2', () => {
  expect(getTotalPages(20, 10)).toBe(2)
})

it('getPageSlice clamps high page to last page', () => {
  const all = [...ten, ...ten]
  const last = getPageSlice(all, 99, 10)
  expect(last).toHaveLength(10)
  expect(last[0].id).toBe('id-10')
})
```
- Example for a negative test
```
{} // missing mandatory fields
{ id: 'x', name: '', imageUrl: 'https://example.com/a.png' } // empty name
{ id: 'x', name: 'Y', imageUrl: '' } // empty imageUrl
```