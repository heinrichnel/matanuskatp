

```tsx
"use client"

import {
  Combobox,
  Portal,
  useFilter,
  useListCollection,
} from "@chakra-ui/react"

export const ComboboxBasic = () => {
  const { contains } = useFilter({ sensitivity: "base" })

  const { collection, filter } = useListCollection({
    initialItems: frameworks,
    filter: contains,
  })

  return (
    <Combobox.Root
      collection={collection}
      onInputValueChange={(e) => filter(e.inputValue)}
      width="320px"
    >
      <Combobox.Label>Select framework</Combobox.Label>
      <Combobox.Control>
        <Combobox.Input placeholder="Type to search" />
        <Combobox.IndicatorGroup>
          <Combobox.ClearTrigger />
          <Combobox.Trigger />
        </Combobox.IndicatorGroup>
      </Combobox.Control>
      <Portal>
        <Combobox.Positioner>
          <Combobox.Content>
            <Combobox.Empty>No items found</Combobox.Empty>
            {collection.items.map((item) => (
              <Combobox.Item item={item} key={item.value}>
                {item.label}
                <Combobox.ItemIndicator />
              </Combobox.Item>
            ))}
          </Combobox.Content>
        </Combobox.Positioner>
      </Portal>
    </Combobox.Root>
  )
}
```


  return (
    <Combobox.Root
      collection={collection}
      onInputValueChange={(e) => filter(e.inputValue)}
      width="320px"
    >
      <Combobox.Label>Select framework</Combobox.Label>
      <Combobox.Control>
        <Combobox.Input placeholder="Type to search" />
        <Combobox.IndicatorGroup>
          <Combobox.ClearTrigger />
          <Combobox.Trigger />
        </Combobox.IndicatorGroup>
      </Combobox.Control>
      <Portal>
        <Combobox.Positioner>
          <Combobox.Content>
            <Combobox.Empty>No items found</Combobox.Empty>
            {collection.items.map((item) => (
              <Combobox.Item item={item} key={item.value}>
                {item.label}
                <Combobox.ItemIndicator />
              </Combobox.Item>
            ))}
          </Combobox.Content>
        </Combobox.Positioner>
      </Portal>
    </Combobox.Root>
  )
}

const frameworks = [
  { label: "React", value: "react" },
  { label: "Solid", value: "solid" },
  { label: "Vue", value: "vue" },
  { label: "Angular", value: "angular" },
  { label: "Svelte", value: "svelte" },
  { label: "Preact", value: "preact" },
  { label: "Qwik", value: "qwik" },
  { label: "Lit", value: "lit" },
  { label: "Alpine.js", value: "alpinejs" },
  { label: "Ember", value: "ember" },
  { label: "Next.js", value: "nextjs" },
]

```

## Usage

```tsx
import { Combobox } from "@chakra-ui/react"
```

```tsx
<Combobox.Root>
  <Combobox.Label />

  <Combobox.Control>
    <Combobox.Input />
    <Combobox.IndicatorGroup>
      <Combobox.ClearTrigger />
      <Combobox.Trigger />
    </Combobox.IndicatorGroup>
  </Combobox.Control>

  <Combobox.Positioner>
    <Combobox.Content>
      <Combobox.Empty />
      <Combobox.Item />

      <Combobox.ItemGroup>
        <Combobox.ItemGroupLabel />
        <Combobox.Item />
      </Combobox.ItemGroup>
    </Combobox.Content>
  </Combobox.Positioner>
</Combobox.Root>
```

To setup combobox, you might need to import the following hooks:

- `useListCollection`: Used to manage the list of items in the combobox,
  providing helpful methods for filtering and mutating the list.

- `useFilter`: Used to provide the filtering logic for the combobox based on
  [`Intl.Collator`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Collator)
  APIs.

## Examples

### Basic

The basic combobox provides a searchable dropdown with single selection.

```tsx
"use client"

import {
  Combobox,
  Portal,
  useFilter,
  useListCollection,
} from "@chakra-ui/react"

export const ComboboxBasic = () => {
  const { contains } = useFilter({ sensitivity: "base" })

  const { collection, filter } = useListCollection({
    initialItems: frameworks,
    filter: contains,
  })

  return (
    <Combobox.Root
      collection={collection}
      onInputValueChange={(e) => filter(e.inputValue)}
      width="320px"
    >
      <Combobox.Label>Select framework</Combobox.Label>
      <Combobox.Control>
        <Combobox.Input placeholder="Type to search" />
        <Combobox.IndicatorGroup>
          <Combobox.ClearTrigger />
          <Combobox.Trigger />
        </Combobox.IndicatorGroup>
      </Combobox.Control>
      <Portal>
        <Combobox.Positioner>
          <Combobox.Content>
            <Combobox.Empty>No items found</Combobox.Empty>
            {collection.items.map((item) => (
              <Combobox.Item item={item} key={item.value}>
                {item.label}
                <Combobox.ItemIndicator />
              </Combobox.Item>
            ))}
          </Combobox.Content>
        </Combobox.Positioner>
      </Portal>
    </Combobox.Root>
  )
}

const frameworks = [
  { label: "React", value: "react" },
  { label: "Solid", value: "solid" },
  { label: "Vue", value: "vue" },
  { label: "Angular", value: "angular" },
  { label: "Svelte", value: "svelte" },
  { label: "Preact", value: "preact" },
  { label: "Qwik", value: "qwik" },
  { label: "Lit", value: "lit" },
  { label: "Alpine.js", value: "alpinejs" },
  { label: "Ember", value: "ember" },
  { label: "Next.js", value: "nextjs" },
]

```

### Sizes

Pass the `size` prop to the `Combobox.Root` to change the size of the combobox.

```tsx
"use client"

import {
  Combobox,
  Portal,
  Stack,
  useFilter,
  useListCollection,
} from "@chakra-ui/react"

export const ComboboxWithSizes = () => {
  return (
    <Stack gap="8">
      <ComboboxDemo size="xs" />
      <ComboboxDemo size="sm" />
      <ComboboxDemo size="md" />
      <ComboboxDemo size="lg" />
    </Stack>
  )
}

const ComboboxDemo = (props: Omit<Combobox.RootProps, "collection">) => {
  const { contains } = useFilter({ sensitivity: "base" })

  const { collection, filter } = useListCollection({
    initialItems: frameworks,
    filter: contains,
  })

  return (
    <Combobox.Root
      {...props}
      onInputValueChange={(e) => filter(e.inputValue)}
      collection={collection}
    >
      <Combobox.Label>
        Select framework ({props.size?.toString()})
      </Combobox.Label>
      <Combobox.Control>
        <Combobox.Input placeholder="Type to search" />
        <Combobox.IndicatorGroup>
          <Combobox.ClearTrigger />
          <Combobox.Trigger />
        </Combobox.IndicatorGroup>
      </Combobox.Control>
      <Portal>
        <Combobox.Positioner>
          <Combobox.Content>
            <Combobox.Empty>No items found</Combobox.Empty>
            {collection.items.map((item) => (
              <Combobox.Item item={item} key={item.value}>
                {item.label}
                <Combobox.ItemIndicator />
              </Combobox.Item>
            ))}
          </Combobox.Content>
        </Combobox.Positioner>
      </Portal>
    </Combobox.Root>
  )
}

const frameworks = [
  { label: "React", value: "react" },
  { label: "Solid", value: "solid" },
  { label: "Vue", value: "vue" },
  { label: "Angular", value: "angular" },
  { label: "Svelte", value: "svelte" },
  { label: "Preact", value: "preact" },
  { label: "Qwik", value: "qwik" },
  { label: "Lit", value: "lit" },
  { label: "Alpine.js", value: "alpinejs" },
  { label: "Ember", value: "ember" },
  { label: "Next.js", value: "nextjs" },
]

```

### Variants

Pass the `variant` prop to the `Combobox.Root` to change the appearance of the
combobox.

```tsx
"use client"

import {
  Combobox,
  Portal,
  Stack,
  useFilter,
  useListCollection,
} from "@chakra-ui/react"

export const ComboboxWithVariants = () => {
  return (
    <Stack gap="8">
      <ComboboxDemo variant="subtle" />
      <ComboboxDemo variant="outline" />
      <ComboboxDemo variant="flushed" />
    </Stack>
  )
}

const ComboboxDemo = (props: Omit<Combobox.RootProps, "collection">) => {
  const { contains } = useFilter({ sensitivity: "base" })

  const { collection, filter } = useListCollection({
    initialItems: frameworks,
    filter: contains,
  })

  return (
    <Combobox.Root
      {...props}
      onInputValueChange={(e) => filter(e.inputValue)}
      collection={collection}
    >
      <Combobox.Label>
        Select framework ({props.variant?.toString()})
      </Combobox.Label>
      <Combobox.Control>
        <Combobox.Input placeholder="Type to search" />
        <Combobox.IndicatorGroup>
          <Combobox.ClearTrigger />
          <Combobox.Trigger />
        </Combobox.IndicatorGroup>
      </Combobox.Control>
      <Portal>
        <Combobox.Positioner>
          <Combobox.Content>
            <Combobox.Empty>No items found</Combobox.Empty>
            {collection.items.map((item) => (
              <Combobox.Item item={item} key={item.value}>
                {item.label}
                <Combobox.ItemIndicator />
              </Combobox.Item>
            ))}
          </Combobox.Content>
        </Combobox.Positioner>
      </Portal>
    </Combobox.Root>
  )
}

const frameworks = [
  { label: "React", value: "react" },
  { label: "Solid", value: "solid" },
  { label: "Vue", value: "vue" },
  { label: "Angular", value: "angular" },
  { label: "Svelte", value: "svelte" },
  { label: "Preact", value: "preact" },
  { label: "Qwik", value: "qwik" },
  { label: "Lit", value: "lit" },
  { label: "Alpine.js", value: "alpinejs" },
  { label: "Ember", value: "ember" },
  { label: "Next.js", value: "nextjs" },
]

```

### Multiple

Pass the `multiple` prop to the `Combobox.Root` to enable multiple selection.
This allows users to select multiple items from the list.

> When this is set, the combobox will always clear the input value when an item
> is selected.

```tsx
"use client"

import {
  Badge,
  Combobox,
  Portal,
  Wrap,
  createListCollection,
} from "@chakra-ui/react"
import { useMemo, useState } from "react"

const skills = [
  "JavaScript",
  "TypeScript",
  "React",
  "Node.js",
  "GraphQL",
  "PostgreSQL",
]

export const ComboboxWithMultiple = () => {
  const [searchValue, setSearchValue] = useState("")
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])

  const filteredItems = useMemo(
    () =>
      skills.filter((item) =>
        item.toLowerCase().includes(searchValue.toLowerCase()),
      ),
    [searchValue],
  )

  const collection = useMemo(
    () => createListCollection({ items: filteredItems }),
    [filteredItems],
  )

  const handleValueChange = (details: Combobox.ValueChangeDetails) => {
    setSelectedSkills(details.value)
  }

  return (
    <Combobox.Root
      multiple
      closeOnSelect
      width="320px"
      value={selectedSkills}
      collection={collection}
      onValueChange={handleValueChange}
      onInputValueChange={(details) => setSearchValue(details.inputValue)}
    >
      <Wrap gap="2">
        {selectedSkills.map((skill) => (
          <Badge key={skill}>{skill}</Badge>
        ))}
      </Wrap>

      <Combobox.Label>Select Skills</Combobox.Label>

      <Combobox.Control>
        <Combobox.Input />
        <Combobox.IndicatorGroup>
          <Combobox.Trigger />
        </Combobox.IndicatorGroup>
      </Combobox.Control>

      <Portal>
        <Combobox.Positioner>
          <Combobox.Content>
            <Combobox.ItemGroup>
              <Combobox.ItemGroupLabel>Skills</Combobox.ItemGroupLabel>
              {filteredItems.map((item) => (
                <Combobox.Item key={item} item={item}>
                  {item}
                  <Combobox.ItemIndicator />
                </Combobox.Item>
              ))}
              <Combobox.Empty>No skills found</Combobox.Empty>
            </Combobox.ItemGroup>
          </Combobox.Content>
        </Combobox.Positioner>
      </Portal>
    </Combobox.Root>
  )
}

```

### Async Loading

Here's an example of loading the `collection` asynchronously as users type,
perfect for API-driven search interfaces.

```tsx
"use client"

import {
  Combobox,
  HStack,
  Portal,
  Span,
  Spinner,
  useListCollection,
} from "@chakra-ui/react"
import { useState } from "react"
import { useAsync } from "react-use"

export const ComboboxWithAsyncContent = () => {
  const [inputValue, setInputValue] = useState("")

  const { collection, set } = useListCollection<Character>({
    initialItems: [],
    itemToString: (item) => item.name,
    itemToValue: (item) => item.name,
  })

  const state = useAsync(async () => {
    const response = await fetch(
      `https://swapi.py4e.com/api/people/?search=${inputValue}`,
    )
    const data = await response.json()
    set(data.results)
  }, [inputValue, set])

  return (
    <Combobox.Root
      width="320px"
      collection={collection}
      placeholder="Example: C-3PO"
      onInputValueChange={(e) => setInputValue(e.inputValue)}
      positioning={{ sameWidth: false, placement: "bottom-start" }}
    >
      <Combobox.Label>Search Star Wars Characters</Combobox.Label>

      <Combobox.Control>
        <Combobox.Input placeholder="Type to search" />
        <Combobox.IndicatorGroup>
          <Combobox.ClearTrigger />
          <Combobox.Trigger />
        </Combobox.IndicatorGroup>
      </Combobox.Control>

      <Portal>
        <Combobox.Positioner>
          <Combobox.Content minW="sm">
            {state.loading ? (
              <HStack p="2">
                <Spinner size="xs" borderWidth="1px" />
                <Span>Loading...</Span>
              </HStack>
            ) : state.error ? (
              <Span p="2" color="fg.error">
                Error fetching
              </Span>
            ) : (
              collection.items?.map((character) => (
                <Combobox.Item key={character.name} item={character}>
                  <HStack justify="space-between" textStyle="sm">
                    <Span fontWeight="medium" truncate>
                      {character.name}
                    </Span>
                    <Span color="fg.muted" truncate>
                      {character.height}cm / {character.mass}kg
                    </Span>
                  </HStack>
                  <Combobox.ItemIndicator />
                </Combobox.Item>
              ))
            )}
          </Combobox.Content>
        </Combobox.Positioner>
      </Portal>
    </Combobox.Root>
  )
}

interface Character {
  name: string
  height: string
  mass: string
  created: string
  edited: string
  url: string
}

```

### Highlight Matching Text

Here's an example of composing the `Combobox.Item` and `Highlight` components to
highlight matching text in search results.

```tsx
"use client"

import {
  Combobox,
  Highlight,
  Portal,
  useComboboxContext,
  useFilter,
  useListCollection,
} from "@chakra-ui/react"

export const ComboboxWithHighlight = () => {
  const { contains } = useFilter({ sensitivity: "base" })

  const { collection, filter } = useListCollection({
    initialItems: frameworks,
    filter: contains,
  })

  return (
    <Combobox.Root
      collection={collection}
      onInputValueChange={(e) => filter(e.inputValue)}
      width="320px"
    >
      <Combobox.Label>Select framework</Combobox.Label>
      <Combobox.Control>
        <Combobox.Input placeholder="Type to search" />
        <Combobox.IndicatorGroup>
          <Combobox.ClearTrigger />
          <Combobox.Trigger />
        </Combobox.IndicatorGroup>
      </Combobox.Control>
      <Portal>
        <Combobox.Positioner>
          <Combobox.Content>
            <Combobox.Empty>No items found</Combobox.Empty>
            {collection.items.map((item) => (
              <ComboboxItem item={item} key={item.value} />
            ))}
          </Combobox.Content>
        </Combobox.Positioner>
      </Portal>
    </Combobox.Root>
  )
}

function ComboboxItem(props: { item: { label: string; value: string } }) {
  const { item } = props
  const combobox = useComboboxContext()
  return (
    <Combobox.Item item={item} key={item.value}>
      <Combobox.ItemText>
        <Highlight
          ignoreCase
          query={combobox.inputValue}
          styles={{ bg: "yellow.emphasized", fontWeight: "medium" }}
        >
          {item.label}
        </Highlight>
      </Combobox.ItemText>
    </Combobox.Item>
  )
}

const frameworks = [
  { label: "React", value: "react" },
  { label: "Solid", value: "solid" },
  { label: "Vue", value: "vue" },
  { label: "Angular", value: "angular" },
  { label: "Svelte", value: "svelte" },
  { label: "Preact", value: "preact" },
  { label: "Qwik", value: "qwik" },
  { label: "Lit", value: "lit" },
  { label: "Alpine.js", value: "alpinejs" },
  { label: "Ember", value: "ember" },
  { label: "Next.js", value: "nextjs" },
]

```

### Open on Click

Use the `openOnClick` prop to open the combobox when the user clicks on the
input.

```tsx
"use client"

import {
  Combobox,
  Portal,
  useFilter,
  useListCollection,
} from "@chakra-ui/react"

export const ComboboxOpenOnClick = () => {
  const { contains } = useFilter({ sensitivity: "base" })

  const { collection, filter } = useListCollection({
    initialItems: frameworks,
    filter: contains,
  })

  return (
    <Combobox.Root
      collection={collection}
      onInputValueChange={(e) => filter(e.inputValue)}
      width="320px"
      openOnClick
    >
      <Combobox.Label>Select framework</Combobox.Label>
      <Combobox.Control>
        <Combobox.Input placeholder="Type to search" />
        <Combobox.IndicatorGroup>
          <Combobox.ClearTrigger />
          <Combobox.Trigger />
        </Combobox.IndicatorGroup>
      </Combobox.Control>
      <Portal>
        <Combobox.Positioner>
          <Combobox.Content>
            <Combobox.Empty>No items found</Combobox.Empty>
            {collection.items.map((item) => (
              <Combobox.Item item={item} key={item.value}>
                {item.label}
                <Combobox.ItemIndicator />
              </Combobox.Item>
            ))}
          </Combobox.Content>
        </Combobox.Positioner>
      </Portal>
    </Combobox.Root>
  )
}

const frameworks = [
  { label: "React", value: "react" },
  { label: "Solid", value: "solid" },
  { label: "Vue", value: "vue" },
  { label: "Angular", value: "angular" },
  { label: "Svelte", value: "svelte" },
  { label: "Preact", value: "preact" },
  { label: "Qwik", value: "qwik" },
  { label: "Lit", value: "lit" },
  { label: "Alpine.js", value: "alpinejs" },
  { label: "Ember", value: "ember" },
  { label: "Next.js", value: "nextjs" },
]

```

### Custom Objects

By default, the combobox collection expects an array of objects with `label` and
`value` properties. In some cases, you may need to deal with custom objects.

Use the `itemToString` and `itemToValue` props to map the custom object to the
required interface.

```tsx
const items = [
  { country: "United States", code: "US", flag: "🇺🇸" },
  { country: "Canada", code: "CA", flag: "🇨🇦" },
  { country: "Australia", code: "AU", flag: "🇦🇺" },
  // ...
]

const { contains } = useFilter({ sensitivity: "base" })

const { collection } = useListCollection({
  initialItems: items,
  itemToString: (item) => item.country,
  itemToValue: (item) => item.code,
  filter: contains,
})
```

```tsx
"use client"

import {
  Combobox,
  Portal,
  useFilter,
  useListCollection,
} from "@chakra-ui/react"

export const ComboboxWithCustomObject = () => {
  const { contains } = useFilter({ sensitivity: "base" })

  const { collection, filter } = useListCollection({
    initialItems: countries,
    itemToString: (item) => item.country,
    itemToValue: (item) => item.code,
    filter: contains,
  })

  const handleInputChange = (details: Combobox.InputValueChangeDetails) => {
    filter(details.inputValue)
  }

  return (
    <Combobox.Root
      collection={collection}
      onInputValueChange={handleInputChange}
    >
      <Combobox.Label>Search Countries</Combobox.Label>
      <Combobox.Control>
        <Combobox.Input placeholder="e.g. United States" />
        <Combobox.IndicatorGroup>
          <Combobox.ClearTrigger />
        </Combobox.IndicatorGroup>
      </Combobox.Control>

      <Portal>
        <Combobox.Positioner>
          <Combobox.Content>
            <Combobox.Empty>No items found</Combobox.Empty>

            {collection.items.map((item) => (
              <Combobox.Item key={item.code} item={item}>
                {item.country}
              </Combobox.Item>
            ))}
          </Combobox.Content>
        </Combobox.Positioner>
      </Portal>
    </Combobox.Root>
  )
}

const countries = [
  { country: "United States", code: "US", flag: "🇺🇸" },
  { country: "Canada", code: "CA", flag: "🇨🇦" },
  { country: "Australia", code: "AU", flag: "🇦🇺" },
  { country: "United Kingdom", code: "UK", flag: "🇬🇧" },
  { country: "New Zealand", code: "NZ", flag: "🇳🇿" },
  { country: "South Africa", code: "ZA", flag: "🇿🇦" },
  { country: "India", code: "IN", flag: "🇮🇳" },
  { country: "China", code: "CN", flag: "🇨🇳" },
  { country: "Japan", code: "JP", flag: "🇯🇵" },
  { country: "Korea", code: "KR", flag: "🇰🇷" },
  { country: "Vietnam", code: "VN", flag: "🇻🇳" },
  { country: "Thailand", code: "TH", flag: "🇹🇭" },
  { country: "Malaysia", code: "MY", flag: "🇲🇾" },
  { country: "Indonesia", code: "ID", flag: "🇮🇩" },
  { country: "Philippines", code: "PH", flag: "🇵🇭" },
  { country: "Singapore", code: "SG", flag: "🇸🇬" },
  { country: "Hong Kong", code: "HK", flag: "🇭🇰" },
  { country: "Macau", code: "MO", flag: "🇲🇴" },
  { country: "Taiwan", code: "TW", flag: "🇹🇼" },
]

```

### Minimum Characters

Use the `openOnChange` prop to set a minimum number of characters before
filtering the list.

```tsx
<Combobox.Root openOnChange={(e) => e.inputValue.length > 2} />
```

```tsx
"use client"

import {
  Combobox,
  Portal,
  useFilter,
  useListCollection,
} from "@chakra-ui/react"

export const ComboboxMinCharacter = () => {
  const { contains } = useFilter({ sensitivity: "base" })

  const { collection, filter } = useListCollection({
    initialItems: frameworks,
    filter: contains,
  })

  return (
    <Combobox.Root
      collection={collection}
      onInputValueChange={(e) => filter(e.inputValue)}
      openOnChange={(e) => e.inputValue.length > 2}
      width="320px"
    >
      <Combobox.Label>Select framework</Combobox.Label>
      <Combobox.Control>
        <Combobox.Input placeholder="Type to search" />
        <Combobox.IndicatorGroup>
          <Combobox.ClearTrigger />
          <Combobox.Trigger />
        </Combobox.IndicatorGroup>
      </Combobox.Control>
      <Portal>
        <Combobox.Positioner>
          <Combobox.Content>
            <Combobox.Empty>No items found</Combobox.Empty>
            {collection.items.map((item) => (
              <Combobox.Item item={item} key={item.value}>
                {item.label}
                <Combobox.ItemIndicator />
              </Combobox.Item>
            ))}
          </Combobox.Content>
        </Combobox.Positioner>
      </Portal>
    </Combobox.Root>
  )
}

const frameworks = [
  { label: "React", value: "react" },
  { label: "Solid", value: "solid" },
  { label: "Vue", value: "vue" },
  { label: "Angular", value: "angular" },
  { label: "Svelte", value: "svelte" },
  { label: "Preact", value: "preact" },
  { label: "Qwik", value: "qwik" },
  { label: "Lit", value: "lit" },
  { label: "Alpine.js", value: "alpinejs" },
  { label: "Ember", value: "ember" },
  { label: "Next.js", value: "nextjs" },
]

```

### Field

Compose the `Combobox` component with the `Field` component to wrap the combobox
in a form field. Useful for form layouts.

```tsx
"use client"

import {
  Combobox,
  Field,
  Portal,
  useFilter,
  useListCollection,
} from "@chakra-ui/react"

export const ComboboxWithField = () => {
  const { contains } = useFilter({ sensitivity: "base" })

  const { collection, filter } = useListCollection({
    initialItems: frameworks,
    filter: contains,
  })

  return (
    <Field.Root width="320px">
      <Field.Label>Select framework</Field.Label>
      <Combobox.Root
        collection={collection}
        onInputValueChange={(e) => filter(e.inputValue)}
      >
        <Combobox.Control>
          <Combobox.Input placeholder="Type to search" />
          <Combobox.IndicatorGroup>
            <Combobox.ClearTrigger />
            <Combobox.Trigger />
          </Combobox.IndicatorGroup>
        </Combobox.Control>
        <Field.HelperText>The framework you love to use</Field.HelperText>

        <Portal>
          <Combobox.Positioner>
            <Combobox.Content>
              <Combobox.Empty>No items found</Combobox.Empty>
              {collection.items.map((item) => (
                <Combobox.Item item={item} key={item.value}>
                  {item.label}
                  <Combobox.ItemIndicator />
                </Combobox.Item>
              ))}
            </Combobox.Content>
          </Combobox.Positioner>
        </Portal>
      </Combobox.Root>
    </Field.Root>
  )
}

const frameworks = [
  { label: "React", value: "react" },
  { label: "Solid", value: "solid" },
  { label: "Vue", value: "vue" },
  { label: "Angular", value: "angular" },
  { label: "Svelte", value: "svelte" },
  { label: "Preact", value: "preact" },
  { label: "Qwik", value: "qwik" },
  { label: "Lit", value: "lit" },
  { label: "Alpine.js", value: "alpinejs" },
  { label: "Ember", value: "ember" },
  { label: "Next.js", value: "nextjs" },
]

```

### Disabled State

Pass the `disabled` prop to the `Combobox.Root` to disable the entire combobox.

```tsx
"use client"

import {
  Combobox,
  Portal,
  useFilter,
  useListCollection,
} from "@chakra-ui/react"

export const ComboboxWithDisabled = () => {
  const { contains } = useFilter({ sensitivity: "base" })

  const { collection, filter } = useListCollection({
    initialItems: frameworks,
    filter: contains,
  })

  return (
    <Combobox.Root
      collection={collection}
      onInputValueChange={(e) => filter(e.inputValue)}
      disabled
      width="320px"
    >
      <Combobox.Label>Select framework</Combobox.Label>
      <Combobox.Control>
        <Combobox.Input placeholder="Type to search" />
        <Combobox.IndicatorGroup>
          <Combobox.ClearTrigger />
          <Combobox.Trigger />
        </Combobox.IndicatorGroup>
      </Combobox.Control>
      <Portal>
        <Combobox.Positioner>
          <Combobox.Content>
            <Combobox.Empty>No items found</Combobox.Empty>
            {collection.items.map((item) => (
              <Combobox.Item item={item} key={item.value}>
                {item.label}
                <Combobox.ItemIndicator />
              </Combobox.Item>
            ))}
          </Combobox.Content>
        </Combobox.Positioner>
      </Portal>
    </Combobox.Root>
  )
}

const frameworks = [
  { label: "React", value: "react" },
  { label: "Solid", value: "solid" },
  { label: "Vue", value: "vue" },
  { label: "Angular", value: "angular" },
  { label: "Svelte", value: "svelte" },
  { label: "Preact", value: "preact" },
  { label: "Qwik", value: "qwik" },
  { label: "Lit", value: "lit" },
  { label: "Alpine.js", value: "alpinejs" },
  { label: "Ember", value: "ember" },
  { label: "Next.js", value: "nextjs" },
]

```

### Disabled Item

Disable specific items in the dropdown, add the `disabled` prop to the
collection item.

```tsx {2}
const items = [
  { label: "Item 1", value: "item-1", disabled: true },
  { label: "Item 2", value: "item-2" },
]

const { collection } = useListCollection({
  initialItems: items,
  // ...
})
```

```tsx
"use client"

import {
  Combobox,
  HStack,
  Icon,
  Portal,
  Span,
  useFilter,
  useListCollection,
} from "@chakra-ui/react"

export const ComboboxWithDisabledItem = () => {
  const { contains } = useFilter({ sensitivity: "base" })

  const { collection, filter } = useListCollection({
    initialItems: companies,
    filter: contains,
    itemToValue: (item) => item.id,
    itemToString: (item) => item.name,
    isItemDisabled: (item) => !!item.disabled,
  })

  const handleInputChange = (details: Combobox.InputValueChangeDetails) => {
    filter(details.inputValue)
  }

  return (
    <Combobox.Root
      width="320px"
      collection={collection}
      placeholder="Type to search companies"
      onInputValueChange={handleInputChange}
    >
      <Combobox.Label>Select a Company</Combobox.Label>
      <Combobox.Control>
        <Combobox.Input />
        <Combobox.IndicatorGroup>
          <Combobox.ClearTrigger />
          <Combobox.Trigger />
        </Combobox.IndicatorGroup>
      </Combobox.Control>

      <Portal>
        <Combobox.Positioner>
          <Combobox.Content>
            <Combobox.ItemGroup>
              <Combobox.ItemGroupLabel>Companies</Combobox.ItemGroupLabel>
              {collection.items.map((country) => {
                return (
                  <Combobox.Item item={country} key={country.id}>
                    <HStack gap="3">
                      <Icon>{country.logo}</Icon>
                      <Span fontWeight="medium">{country.name}</Span>
                    </HStack>
                    <Combobox.ItemIndicator />
                  </Combobox.Item>
                )
              })}
            </Combobox.ItemGroup>
          </Combobox.Content>
        </Combobox.Positioner>
      </Portal>
    </Combobox.Root>
  )
}

interface Company {
  id: string
  name: string
  logo: React.ReactElement
  disabled?: boolean
}

const companies: Company[] = [
  {
    id: "airbnb",
    name: "Airbnb",
    logo: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18">
        <g clipPath="url(#airbnb)">
          <path fill="#EB4C60" d="M0 0h18v18H0V0Z" />
          <path
            fill="#fff"
            d="m13.565 10.777.051.123c.133.372.173.724.092 1.076a2.142 2.142 0 0 1-1.33 1.672 2.095 2.095 0 0 1-1.096.141 2.737 2.737 0 0 1-1.023-.342c-.41-.231-.819-.564-1.269-1.047-.45.483-.85.816-1.27 1.047a2.73 2.73 0 0 1-1.29.362c-.286 0-.562-.05-.828-.16a2.146 2.146 0 0 1-1.33-1.673 2.211 2.211 0 0 1 .122-1.087c.051-.13.103-.252.153-.362l.112-.242.124-.271.011-.02a115.31 115.31 0 0 1 2.261-4.552l.03-.061c.083-.151.165-.312.246-.473a3.45 3.45 0 0 1 .37-.553 1.725 1.725 0 0 1 1.31-.605c.501 0 .972.221 1.299.625.15.167.25.342.344.51l.025.043c.081.161.163.322.246.473l.03.061a104.224 104.224 0 0 1 2.262 4.552l.01.01.124.271.112.242c.034.073.067.156.102.24Zm-5.6-1.227c.123.544.482 1.188 1.035 1.873.552-.695.911-1.339 1.034-1.873.05-.201.06-.41.03-.615a.968.968 0 0 0-.163-.422C9.715 8.232 9.379 8.07 9 8.07a1.092 1.092 0 0 0-.9.443.968.968 0 0 0-.165.423c-.03.205-.019.414.031.615l-.001-.001Zm4.187 3.524c.503-.201.86-.654.932-1.178.037-.26.013-.526-.071-.775a1.97 1.97 0 0 0-.088-.216 5.032 5.032 0 0 1-.046-.107 7.415 7.415 0 0 1-.118-.251 5.735 5.735 0 0 0-.117-.252v-.01a132.7 132.7 0 0 0-2.242-4.53l-.03-.061-.123-.232-.123-.232a2.211 2.211 0 0 0-.287-.443 1.078 1.078 0 0 0-.819-.372 1.078 1.078 0 0 0-.818.372c-.113.136-.21.284-.287.443-.042.077-.083.155-.123.232-.04.079-.082.157-.123.232l-.03.06a109.354 109.354 0 0 0-2.253 4.521l-.01.02a20.74 20.74 0 0 0-.281.61 1.951 1.951 0 0 0-.087.216 1.639 1.639 0 0 0-.092.785 1.5 1.5 0 0 0 .931 1.178c.235.09.502.13.778.1.257-.03.512-.11.778-.26.369-.202.748-.515 1.167-.978-.665-.816-1.084-1.57-1.239-2.235a2.058 2.058 0 0 1-.051-.855c.041-.253.134-.484.277-.685.317-.443.85-.716 1.442-.716.595 0 1.127.263 1.444.716.143.2.235.432.276.685.031.261.021.543-.051.855-.153.665-.563 1.41-1.239 2.225.43.464.8.776 1.167.977.266.15.522.231.778.262.267.03.533 0 .778-.101Z"
          />
        </g>
        <defs>
          <clipPath id="airbnb">
            <path fill="#fff" d="M0 0h18v18H0z" />
          </clipPath>
        </defs>
      </svg>
    ),
  },
  {
    id: "tesla",
    disabled: true,
    logo: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18">
        <g clipPath="url(#tesla)">
          <path fill="#E31937" d="M0 0h18v18H0V0Z" />
          <path
            fill="#fff"
            d="m9 15 1.5-8c1.334 0 1.654.272 1.715.872 0 0 .894-.335 1.346-1.016C11.8 6.037 10 6 10 6L9 7.25 8 6s-1.8.037-3.56.856c.45.68 1.345 1.016 1.345 1.016.061-.6.39-.871 1.715-.872L9 15Z"
          />
          <path
            fill="#fff"
            d="M9 5.608a11.35 11.35 0 0 1 4.688.955C13.91 6.16 14 6 14 6c-1.823-.724-3.53-.994-5-1-1.47.006-3.177.276-5 1 0 0 .114.2.313.563A11.348 11.348 0 0 1 9 5.608Z"
          />
        </g>
        <defs>
          <clipPath id="tesla">
            <path fill="#fff" d="M0 0h18v18H0z" />
          </clipPath>
        </defs>
      </svg>
    ),
    name: "Tesla",
  },
  {
    logo: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18">
        <g clipPath="url(#nvidia-a)">
          <path fill="url(#nvidia-b)" d="M0 0h18v18H0V0Z" />
          <path
            fill="#fff"
            d="M7.601 7.57v-.656c.065-.004.13-.008.195-.008 1.797-.057 2.975 1.547 2.975 1.547S9.5 10.218 8.136 10.218c-.183 0-.36-.029-.53-.085V8.14c.7.085.841.393 1.258 1.093l.936-.786s-.685-.894-1.834-.894a2.745 2.745 0 0 0-.365.016Zm0-2.17v.98l.195-.012c2.497-.086 4.13 2.048 4.13 2.048s-1.871 2.275-3.819 2.275c-.17 0-.336-.016-.502-.044v.607c.138.016.28.029.417.029 1.814 0 3.126-.928 4.397-2.02.21.17 1.073.578 1.251.756-1.206 1.012-4.02 1.826-5.615 1.826-.154 0-.3-.008-.446-.024v.854H14.5V5.4H7.601Zm0 4.733v.518c-1.676-.3-2.141-2.045-2.141-2.045s.805-.89 2.141-1.036v.567h-.004c-.7-.085-1.25.57-1.25.57s.31 1.106 1.254 1.426Zm-2.975-1.6s.991-1.465 2.98-1.619V6.38C5.402 6.558 3.5 8.42 3.5 8.42s1.077 3.118 4.101 3.401v-.567c-2.218-.275-2.975-2.72-2.975-2.72Z"
          />
        </g>
        <defs>
          <linearGradient
            id="nvidia-b"
            x1="16"
            x2="5.5"
            y1="-.5"
            y2="18"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#85B737" />
            <stop offset="1" stopColor="#597B20" />
          </linearGradient>
          <clipPath id="nvidia-a">
            <path fill="#fff" d="M0 0h18v18H0z" />
          </clipPath>
        </defs>
      </svg>
    ),
    id: "nvida",
    name: "NVIDA",
  },
  {
    id: "amazon",
    name: "Amazon",
    logo: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18">
        <g clipPath="url(#amazon)">
          <path d="M0 0h18v18H0V0Z" />
          <path
            fill="#fff"
            d="M12.237 10.734c-.259-.327-.458-.56-.458-1.189V7.46c0-.88-.06-1.703-.708-2.306-.519-.478-1.373-.654-2.047-.654-1.425 0-2.698.58-3.01 2.137-.026.177.104.252.207.278l1.351.123c.13 0 .208-.125.234-.25.104-.529.572-.972 1.09-.972.285 0 .848.287.848.89v.754c-.83 0-1.757.056-2.483.357-.855.353-1.586 1.028-1.586 2.11 0 1.382 1.064 2.137 2.204 2.137.96 0 1.482-.25 2.232-.979.235.352.38.603.82.979.105.051.234.051.31-.024.26-.228.712-.703.996-.929.13-.102.104-.252 0-.377ZM9.744 8.775c0 .502-.098 1.756-1.368 1.756-.653 0-.666-.769-.666-.769 0-.988 1.049-1.317 2.034-1.317v.33Z"
          />
          <path
            fill="#FFB300"
            d="M12.917 12.952C11.862 13.601 10.284 14 9.005 14a7.818 7.818 0 0 1-4.713-1.551c-.101-.084 0-.168.1-.126 1.432.685 3 1.036 4.587 1.026 1.154 0 2.609-.209 3.787-.628.174-.042.325.126.15.231Zm.376-.44c-.125-.147-.878-.063-1.204-.043-.101 0-.125-.062-.025-.125.576-.357 1.554-.252 1.655-.126.1.126-.026.943-.577 1.32-.076.064-.176.021-.126-.04.126-.253.402-.84.276-.987Z"
          />
        </g>
        <defs>
          <clipPath id="amazon">
            <path fill="#fff" d="M0 0h18v18H0z" />
          </clipPath>
        </defs>
      </svg>
    ),
  },
]

```

### Input Group

Combine with InputGroup to add icons or other elements.

```tsx
"use client"

import {
  Combobox,
  InputGroup,
  Portal,
  useFilter,
  useListCollection,
} from "@chakra-ui/react"
import { LuCode } from "react-icons/lu"

export const ComboboxWithInputGroup = () => {
  const { contains } = useFilter({ sensitivity: "base" })

  const { collection, filter } = useListCollection({
    initialItems: frameworks,
    filter: contains,
  })

  return (
    <Combobox.Root
      collection={collection}
      onInputValueChange={(e) => filter(e.inputValue)}
      width="320px"
    >
      <Combobox.Label>Select framework</Combobox.Label>
      <Combobox.Control>
        <InputGroup startElement={<LuCode />}>
          <Combobox.Input placeholder="Type to search" />
        </InputGroup>
        <Combobox.IndicatorGroup>
          <Combobox.ClearTrigger />
          <Combobox.Trigger />
        </Combobox.IndicatorGroup>
      </Combobox.Control>
      <Portal>
        <Combobox.Positioner>
          <Combobox.Content>
            <Combobox.Empty>No items found</Combobox.Empty>
            {collection.items.map((item) => (
              <Combobox.Item item={item} key={item.value}>
                {item.label}
                <Combobox.ItemIndicator />
              </Combobox.Item>
            ))}
          </Combobox.Content>
        </Combobox.Positioner>
      </Portal>
    </Combobox.Root>
  )
}

const frameworks = [
  { label: "React", value: "react" },
  { label: "Solid", value: "solid" },
  { label: "Vue", value: "vue" },
  { label: "Angular", value: "angular" },
  { label: "Svelte", value: "svelte" },
  { label: "Preact", value: "preact" },
  { label: "Qwik", value: "qwik" },
  { label: "Lit", value: "lit" },
  { label: "Alpine.js", value: "alpinejs" },
  { label: "Ember", value: "ember" },
  { label: "Next.js", value: "nextjs" },
]

```

### Invalid

Pass the `invalid` prop to the `Combobox.Root` to show the error state.

```tsx
"use client"

import {
  Combobox,
  Portal,
  useFilter,
  useListCollection,
} from "@chakra-ui/react"

export const ComboboxWithInvalid = () => {
  const { contains } = useFilter({ sensitivity: "base" })

  const { collection, filter } = useListCollection({
    initialItems: frameworks,
    filter: contains,
  })

  return (
    <Combobox.Root
      collection={collection}
      onInputValueChange={(e) => filter(e.inputValue)}
      width="320px"
      invalid
    >
      <Combobox.Label>Select framework</Combobox.Label>
      <Combobox.Control>
        <Combobox.Input placeholder="Type to search" />
        <Combobox.IndicatorGroup>
          <Combobox.ClearTrigger />
          <Combobox.Trigger />
        </Combobox.IndicatorGroup>
      </Combobox.Control>
      <Portal>
        <Combobox.Positioner>
          <Combobox.Content>
            <Combobox.Empty>No items found</Combobox.Empty>
            {collection.items.map((item) => (
              <Combobox.Item item={item} key={item.value}>
                {item.label}
                <Combobox.ItemIndicator />
              </Combobox.Item>
            ))}
          </Combobox.Content>
        </Combobox.Positioner>
      </Portal>
    </Combobox.Root>
  )
}

const frameworks = [
  { label: "React", value: "react" },
  { label: "Solid", value: "solid" },
  { label: "Vue", value: "vue" },
  { label: "Angular", value: "angular" },
  { label: "Svelte", value: "svelte" },
  { label: "Preact", value: "preact" },
  { label: "Qwik", value: "qwik" },
  { label: "Lit", value: "lit" },
  { label: "Alpine.js", value: "alpinejs" },
  { label: "Ember", value: "ember" },
  { label: "Next.js", value: "nextjs" },
]

```

### Controlled Value

Use the `value` and `onValueChange` props to control the combobox's value
programmatically.

```tsx
"use client"

import {
  Badge,
  Combobox,
  For,
  HStack,
  Portal,
  useFilter,
  useListCollection,
} from "@chakra-ui/react"
import { useState } from "react"

export const ComboboxControlled = () => {
  const [value, setValue] = useState<string[]>([])

  const { contains } = useFilter({ sensitivity: "base" })

  const { collection, filter } = useListCollection({
    initialItems: frameworks,
    filter: contains,
  })

  return (
    <Combobox.Root
      collection={collection}
      onInputValueChange={(e) => filter(e.inputValue)}
      value={value}
      onValueChange={(e) => setValue(e.value)}
      width="320px"
    >
      <HStack textStyle="sm" mb="6">
        Selected:
        <HStack>
          <For each={value} fallback="N/A">
            {(v) => <Badge key={v}>{v}</Badge>}
          </For>
        </HStack>
      </HStack>
      <Combobox.Label>Select framework</Combobox.Label>
      <Combobox.Control>
        <Combobox.Input placeholder="Type to search" />
        <Combobox.IndicatorGroup>
          <Combobox.ClearTrigger />
          <Combobox.Trigger />
        </Combobox.IndicatorGroup>
      </Combobox.Control>
      <Portal>
        <Combobox.Positioner>
          <Combobox.Content>
            <Combobox.Empty>No items found</Combobox.Empty>
            {collection.items.map((item) => (
              <Combobox.Item item={item} key={item.value}>
                {item.label}
                <Combobox.ItemIndicator />
              </Combobox.Item>
            ))}
          </Combobox.Content>
        </Combobox.Positioner>
      </Portal>
    </Combobox.Root>
  )
}

const frameworks = [
  { label: "React", value: "react" },
  { label: "Solid", value: "solid" },
  { label: "Vue", value: "vue" },
  { label: "Angular", value: "angular" },
  { label: "Svelte", value: "svelte" },
  { label: "Preact", value: "preact" },
  { label: "Qwik", value: "qwik" },
  { label: "Lit", value: "lit" },
  { label: "Alpine.js", value: "alpinejs" },
  { label: "Ember", value: "ember" },
  { label: "Next.js", value: "nextjs" },
]

```

### Store

An alternative way to control the combobox is to use the `Combobox.RootProvider`
component and the `useCombobox` store hook.

```tsx
import { Combobox, useCombobox } from "@chakra-ui/react"

function Demo() {
  const combobox = useCombobox()

  return (
    <Combobox.RootProvider value={combobox}>{/* ... */}</Combobox.RootProvider>
  )
}
```

This way you can access the combobox state and methods from outside the
combobox.

```tsx
"use client"

import {
  Combobox,
  Portal,
  useCombobox,
  useFilter,
  useListCollection,
} from "@chakra-ui/react"

export const ComboboxWithStore = () => {
  const { contains } = useFilter({ sensitivity: "base" })

  const { collection, filter } = useListCollection({
    initialItems: frameworks,
    filter: contains,
  })

  const combobox = useCombobox({
    collection,
    onInputValueChange(e) {
      filter(e.inputValue)
    },
  })

  return (
    <Combobox.RootProvider value={combobox} width="320px">
      <Combobox.Label>Select framework</Combobox.Label>

      <Combobox.Control>
        <Combobox.Input placeholder="Type to search" />
        <Combobox.IndicatorGroup>
          <Combobox.ClearTrigger />
          <Combobox.Trigger />
        </Combobox.IndicatorGroup>
      </Combobox.Control>

      <Portal>
        <Combobox.Positioner>
          <Combobox.Content>
            {collection.items.map((item) => (
              <Combobox.Item item={item} key={item.value}>
                {item.label}
                <Combobox.ItemIndicator />
              </Combobox.Item>
            ))}
          </Combobox.Content>
        </Combobox.Positioner>
      </Portal>
    </Combobox.RootProvider>
  )
}

const frameworks = [
  { label: "React", value: "react" },
  { label: "Solid", value: "solid" },
  { label: "Vue", value: "vue" },
  { label: "Angular", value: "angular" },
  { label: "Svelte", value: "svelte" },
  { label: "Preact", value: "preact" },
  { label: "Qwik", value: "qwik" },
  { label: "Lit", value: "lit" },
  { label: "Alpine.js", value: "alpinejs" },
  { label: "Ember", value: "ember" },
  { label: "Next.js", value: "nextjs" },
]

```

### Controlled Open

Use the `open` and `onOpenChange` props to control the combobox's open state
programmatically.

```tsx
"use client"

import {
  Combobox,
  Portal,
  useFilter,
  useListCollection,
} from "@chakra-ui/react"
import { useState } from "react"

export const ComboboxOpenControlled = () => {
  const [open, setOpen] = useState(false)

  const { contains } = useFilter({ sensitivity: "base" })

  const { collection, filter } = useListCollection({
    initialItems: frameworks,
    filter: contains,
  })

  return (
    <Combobox.Root
      collection={collection}
      onInputValueChange={(e) => filter(e.inputValue)}
      width="320px"
      open={open}
      onOpenChange={(e) => setOpen(e.open)}
    >
      <Combobox.Label>Combobox is {open ? "open" : "closed"}</Combobox.Label>

      <Combobox.Control>
        <Combobox.Input placeholder="Type to search" />
        <Combobox.IndicatorGroup>
          <Combobox.ClearTrigger />
          <Combobox.Trigger />
        </Combobox.IndicatorGroup>
      </Combobox.Control>

      <Portal>
        <Combobox.Positioner>
          <Combobox.Content>
            <Combobox.Empty>No items found</Combobox.Empty>
            {collection.items.map((item) => (
              <Combobox.Item item={item} key={item.value}>
                {item.label}
                <Combobox.ItemIndicator />
              </Combobox.Item>
            ))}
          </Combobox.Content>
        </Combobox.Positioner>
      </Portal>
    </Combobox.Root>
  )
}

const frameworks = [
  { label: "React", value: "react" },
  { label: "Solid", value: "solid" },
  { label: "Vue", value: "vue" },
  { label: "Angular", value: "angular" },
  { label: "Svelte", value: "svelte" },
  { label: "Preact", value: "preact" },
  { label: "Qwik", value: "qwik" },
  { label: "Lit", value: "lit" },
  { label: "Alpine.js", value: "alpinejs" },
  { label: "Ember", value: "ember" },
  { label: "Next.js", value: "nextjs" },
]

```

### Limit Large Datasets

The recommended way of managing large lists is to use the `limit` property on
the `useListCollection` hook. This will limit the number of rendered items in
the DOM to improve performance.

```tsx
"use client"

import {
  Combobox,
  Portal,
  useFilter,
  useListCollection,
} from "@chakra-ui/react"
import { useRef } from "react"

export const ComboboxWithLimit = () => {
  const contentRef = useRef<HTMLDivElement>(null)

  const { startsWith } = useFilter({ sensitivity: "base" })

  const { collection, filter, reset } = useListCollection({
    initialItems: items,
    filter: startsWith,
    limit: 10,
  })

  return (
    <Combobox.Root
      collection={collection}
      onInputValueChange={(e) => filter(e.inputValue)}
      openOnClick
      width="320px"
    >
      <Combobox.Label>Select framework</Combobox.Label>
      <Combobox.Control>
        <Combobox.Input placeholder="Type to search" />
        <Combobox.IndicatorGroup>
          <Combobox.ClearTrigger />
          <Combobox.Trigger onClick={reset} />
        </Combobox.IndicatorGroup>
      </Combobox.Control>
      <Portal>
        <Combobox.Positioner>
          <Combobox.Content ref={contentRef}>
            {collection.items.map((item) => (
              <Combobox.Item key={item.value} item={item}>
                <Combobox.ItemText truncate>
                  <span aria-hidden style={{ marginRight: 4 }}>
                    {item.emoji}
                  </span>
                  {item.label}
                </Combobox.ItemText>
                <Combobox.ItemIndicator />
              </Combobox.Item>
            ))}
          </Combobox.Content>
        </Combobox.Positioner>
      </Portal>
    </Combobox.Root>
  )
}

export const items = [
  { value: "AD", label: "Andorra", emoji: "🇦🇩" },
  { value: "AE", label: "United Arab Emirates", emoji: "🇦🇪" },
  { value: "AF", label: "Afghanistan", emoji: "🇦🇫" },
  { value: "AG", label: "Antigua and Barbuda", emoji: "🇦🇬" },
  { value: "AI", label: "Anguilla", emoji: "🇦🇮" },
  { value: "AL", label: "Albania", emoji: "🇦🇱" },
  { value: "AM", label: "Armenia", emoji: "🇦🇲" },
  { value: "AO", label: "Angola", emoji: "🇦🇴" },
  { value: "AQ", label: "Antarctica", emoji: "🇦🇶" },
  { value: "AR", label: "Argentina", emoji: "🇦🇷" },
  { value: "AS", label: "American Samoa", emoji: "🇦🇸" },
  { value: "AT", label: "Austria", emoji: "🇦🇹" },
  { value: "AU", label: "Australia", emoji: "🇦🇺" },
  { value: "AW", label: "Aruba", emoji: "🇦🇼" },
  { value: "AX", label: "Åland Islands", emoji: "🇦🇽" },
  { value: "AZ", label: "Azerbaijan", emoji: "🇦🇿" },
  { value: "BA", label: "Bosnia and Herzegovina", emoji: "🇧🇦" },
  { value: "BB", label: "Barbados", emoji: "🇧🇧" },
  { value: "BD", label: "Bangladesh", emoji: "🇧🇩" },
  { value: "BE", label: "Belgium", emoji: "🇧🇪" },
  { value: "BF", label: "Burkina Faso", emoji: "🇧🇫" },
  { value: "BG", label: "Bulgaria", emoji: "🇧🇬" },
  { value: "BH", label: "Bahrain", emoji: "🇧🇭" },
  { value: "BI", label: "Burundi", emoji: "🇧🇮" },
  { value: "BJ", label: "Benin", emoji: "🇧🇯" },
  { value: "BL", label: "Saint Barthélemy", emoji: "🇧🇱" },
  { value: "BM", label: "Bermuda", emoji: "🇧🇲" },
  { value: "BN", label: "Brunei Darussalam", emoji: "🇧🇳" },
  { value: "BO", label: "Bolivia, Plurinational State of", emoji: "🇧🇴" },
  { value: "BQ", label: "Bonaire, Sint Eustatius and Saba", emoji: "🇧🇶" },
  { value: "BR", label: "Brazil", emoji: "🇧🇷" },
  { value: "BS", label: "Bahamas", emoji: "🇧🇸" },
  { value: "BT", label: "Bhutan", emoji: "🇧🇹" },
  { value: "BV", label: "Bouvet Island", emoji: "🇧🇻" },
  { value: "BW", label: "Botswana", emoji: "🇧🇼" },
  { value: "BY", label: "Belarus", emoji: "🇧🇾" },
  { value: "BZ", label: "Belize", emoji: "🇧🇿" },
  { value: "CA", label: "Canada", emoji: "🇨🇦" },
  { value: "CC", label: "Cocos (Keeling) Islands", emoji: "🇨🇨" },
  { value: "CD", label: "Congo, Democratic Republic of the", emoji: "🇨🇩" },
  { value: "CF", label: "Central African Republic", emoji: "🇨🇫" },
  { value: "CG", label: "Congo", emoji: "🇨🇬" },
  { value: "CH", label: "Switzerland", emoji: "🇨🇭" },
  { value: "CI", label: "Côte d'Ivoire", emoji: "🇨🇮" },
  { value: "CK", label: "Cook Islands", emoji: "🇨🇰" },
  { value: "CL", label: "Chile", emoji: "🇨🇱" },
  { value: "CM", label: "Cameroon", emoji: "🇨🇲" },
  { value: "CN", label: "China", emoji: "🇨🇳" },
  { value: "CO", label: "Colombia", emoji: "🇨🇴" },
  { value: "CR", label: "Costa Rica", emoji: "🇨🇷" },
  { value: "CU", label: "Cuba", emoji: "🇨🇺" },
  { value: "CV", label: "Cabo Verde", emoji: "🇨🇻" },
  { value: "CW", label: "Curaçao", emoji: "🇨🇼" },
  { value: "CX", label: "Christmas Island", emoji: "🇨🇽" },
  { value: "CY", label: "Cyprus", emoji: "🇨🇾" },
  { value: "CZ", label: "Czechia", emoji: "🇨🇿" },
  { value: "DE", label: "Germany", emoji: "🇩🇪" },
  { value: "DJ", label: "Djibouti", emoji: "🇩🇯" },
  { value: "DK", label: "Denmark", emoji: "🇩🇰" },
  { value: "DM", label: "Dominica", emoji: "🇩🇲" },
  { value: "DO", label: "Dominican Republic", emoji: "🇩🇴" },
  { value: "DZ", label: "Algeria", emoji: "🇩🇿" },
  { value: "EC", label: "Ecuador", emoji: "🇪🇨" },
  { value: "EE", label: "Estonia", emoji: "🇪🇪" },
  { value: "EG", label: "Egypt", emoji: "🇪🇬" },
  { value: "EH", label: "Western Sahara", emoji: "🇪🇭" },
  { value: "ER", label: "Eritrea", emoji: "🇪🇷" },
  { value: "ES", label: "Spain", emoji: "🇪🇸" },
  { value: "ET", label: "Ethiopia", emoji: "🇪🇹" },
  { value: "FI", label: "Finland", emoji: "🇫🇮" },
  { value: "FJ", label: "Fiji", emoji: "🇫🇯" },
  { value: "FK", label: "Falkland Islands (Malvinas)", emoji: "🇫🇰" },
  { value: "FM", label: "Micronesia, Federated States of", emoji: "🇫🇲" },
  { value: "FO", label: "Faroe Islands", emoji: "🇫🇴" },
  { value: "FR", label: "France", emoji: "🇫🇷" },
  { value: "GA", label: "Gabon", emoji: "🇬🇦" },
  {
    value: "GB",
    label: "United Kingdom of Great Britain and Northern Ireland",
    emoji: "🇬🇧",
  },
  { value: "GD", label: "Grenada", emoji: "🇬🇩" },
  { value: "GE", label: "Georgia", emoji: "🇬🇪" },
  { value: "GF", label: "French Guiana", emoji: "🇬🇫" },
  { value: "GG", label: "Guernsey", emoji: "🇬🇬" },
  { value: "GH", label: "Ghana", emoji: "🇬🇭" },
  { value: "GI", label: "Gibraltar", emoji: "🇬🇮" },
  { value: "GL", label: "Greenland", emoji: "🇬🇱" },
  { value: "GM", label: "Gambia", emoji: "🇬🇲" },
  { value: "GN", label: "Guinea", emoji: "🇬🇳" },
  { value: "GP", label: "Guadeloupe", emoji: "🇬🇵" },
  { value: "GQ", label: "Equatorial Guinea", emoji: "🇬🇶" },
  { value: "GR", label: "Greece", emoji: "🇬🇷" },
  {
    value: "GS",
    label: "South Georgia and the South Sandwich Islands",
    emoji: "🇬🇸",
  },
  { value: "GT", label: "Guatemala", emoji: "🇬🇹" },
  { value: "GU", label: "Guam", emoji: "🇬🇺" },
  { value: "GW", label: "Guinea-Bissau", emoji: "🇬🇼" },
  { value: "GY", label: "Guyana", emoji: "🇬🇾" },
  { value: "HK", label: "Hong Kong", emoji: "🇭🇰" },
  { value: "HM", label: "Heard Island and McDonald Islands", emoji: "🇭🇲" },
  { value: "HN", label: "Honduras", emoji: "🇭🇳" },
  { value: "HR", label: "Croatia", emoji: "🇭🇷" },
  { value: "HT", label: "Haiti", emoji: "🇭🇹" },
  { value: "HU", label: "Hungary", emoji: "🇭🇺" },
  { value: "ID", label: "Indonesia", emoji: "🇮🇩" },
  { value: "IE", label: "Ireland", emoji: "🇮🇪" },
  { value: "IL", label: "Israel", emoji: "🇮🇱" },
  { value: "IM", label: "Isle of Man", emoji: "🇮🇲" },
  { value: "IN", label: "India", emoji: "🇮🇳" },
  { value: "IO", label: "British Indian Ocean Territory", emoji: "🇮🇴" },
  { value: "IQ", label: "Iraq", emoji: "🇮🇶" },
  { value: "IR", label: "Iran, Islamic Republic of", emoji: "🇮🇷" },
  { value: "IS", label: "Iceland", emoji: "🇮🇸" },
  { value: "IT", label: "Italy", emoji: "🇮🇹" },
  { value: "JE", label: "Jersey", emoji: "🇯🇪" },
  { value: "JM", label: "Jamaica", emoji: "🇯🇲" },
  { value: "JO", label: "Jordan", emoji: "🇯🇴" },
  { value: "JP", label: "Japan", emoji: "🇯🇵" },
  { value: "KE", label: "Kenya", emoji: "🇰🇪" },
  { value: "KG", label: "Kyrgyzstan", emoji: "🇰🇬" },
  { value: "KH", label: "Cambodia", emoji: "🇰🇭" },
  { value: "KI", label: "Kiribati", emoji: "🇰🇮" },
  { value: "KM", label: "Comoros", emoji: "🇰🇲" },
  { value: "KN", label: "Saint Kitts and Nevis", emoji: "🇰🇳" },
  { value: "KP", label: "Korea, Democratic People's Republic of", emoji: "🇰🇵" },
  { value: "KR", label: "Korea, Republic of", emoji: "🇰🇷" },
  { value: "KW", label: "Kuwait", emoji: "🇰🇼" },
  { value: "KY", label: "Cayman Islands", emoji: "🇰🇾" },
  { value: "KZ", label: "Kazakhstan", emoji: "🇰🇿" },
  { value: "LA", label: "Lao People's Democratic Republic", emoji: "🇱🇦" },
  { value: "LB", label: "Lebanon", emoji: "🇱🇧" },
  { value: "LC", label: "Saint Lucia", emoji: "🇱🇨" },
  { value: "LI", label: "Liechtenstein", emoji: "🇱🇮" },
  { value: "LK", label: "Sri Lanka", emoji: "🇱🇰" },
  { value: "LR", label: "Liberia", emoji: "🇱🇷" },
  { value: "LS", label: "Lesotho", emoji: "🇱🇸" },
  { value: "LT", label: "Lithuania", emoji: "🇱🇹" },
  { value: "LU", label: "Luxembourg", emoji: "🇱🇺" },
  { value: "LV", label: "Latvia", emoji: "🇱🇻" },
  { value: "LY", label: "Libya", emoji: "🇱🇾" },
  { value: "MA", label: "Morocco", emoji: "🇲🇦" },
  { value: "MC", label: "Monaco", emoji: "🇲🇨" },
  { value: "MD", label: "Moldova, Republic of", emoji: "🇲🇩" },
  { value: "ME", label: "Montenegro", emoji: "🇲🇪" },
  { value: "MF", label: "Saint Martin, (French part)", emoji: "🇲🇫" },
  { value: "MG", label: "Madagascar", emoji: "🇲🇬" },
  { value: "MH", label: "Marshall Islands", emoji: "🇲🇭" },
  { value: "MK", label: "North Macedonia", emoji: "🇲🇰" },
  { value: "ML", label: "Mali", emoji: "🇲🇱" },
  { value: "MM", label: "Myanmar", emoji: "🇲🇲" },
  { value: "MN", label: "Mongolia", emoji: "🇲🇳" },
  { value: "MO", label: "Macao", emoji: "🇲🇴" },
  { value: "MP", label: "Northern Mariana Islands", emoji: "🇲🇵" },
  { value: "MQ", label: "Martinique", emoji: "🇲🇶" },
  { value: "MR", label: "Mauritania", emoji: "🇲🇷" },
  { value: "MS", label: "Montserrat", emoji: "🇲🇸" },
  { value: "MT", label: "Malta", emoji: "🇲🇹" },
  { value: "MU", label: "Mauritius", emoji: "🇲🇺" },
  { value: "MV", label: "Maldives", emoji: "🇲🇻" },
  { value: "MW", label: "Malawi", emoji: "🇲🇼" },
  { value: "MX", label: "Mexico", emoji: "🇲🇽" },
  { value: "MY", label: "Malaysia", emoji: "🇲🇾" },
  { value: "MZ", label: "Mozambique", emoji: "🇲🇿" },
  { value: "NA", label: "Namibia", emoji: "🇳🇦" },
  { value: "NC", label: "New Caledonia", emoji: "🇳🇨" },
  { value: "NE", label: "Niger", emoji: "🇳🇪" },
  { value: "NF", label: "Norfolk Island", emoji: "🇳🇫" },
  { value: "NG", label: "Nigeria", emoji: "🇳🇬" },
  { value: "NI", label: "Nicaragua", emoji: "🇳🇮" },
  { value: "NL", label: "Netherlands", emoji: "🇳🇱" },
  { value: "NO", label: "Norway", emoji: "🇳🇴" },
  { value: "NP", label: "Nepal", emoji: "🇳🇵" },
  { value: "NR", label: "Nauru", emoji: "🇳🇷" },
  { value: "NU", label: "Niue", emoji: "🇳🇺" },
  { value: "NZ", label: "New Zealand", emoji: "🇳🇿" },
  { value: "OM", label: "Oman", emoji: "🇴🇲" },
  { value: "PA", label: "Panama", emoji: "🇵🇦" },
  { value: "PE", label: "Peru", emoji: "🇵🇪" },
  { value: "PF", label: "French Polynesia", emoji: "🇵🇫" },
  { value: "PG", label: "Papua New Guinea", emoji: "🇵🇬" },
  { value: "PH", label: "Philippines", emoji: "🇵🇭" },
  { value: "PK", label: "Pakistan", emoji: "🇵🇰" },
  { value: "PL", label: "Poland", emoji: "🇵🇱" },
  { value: "PM", label: "Saint Pierre and Miquelon", emoji: "🇵🇲" },
  { value: "PN", label: "Pitcairn", emoji: "🇵🇳" },
  { value: "PR", label: "Puerto Rico", emoji: "🇵🇷" },
  { value: "PS", label: "Palestine, State of", emoji: "🇵🇸" },
  { value: "PT", label: "Portugal", emoji: "🇵🇹" },
  { value: "PW", label: "Palau", emoji: "🇵🇼" },
  { value: "PY", label: "Paraguay", emoji: "🇵🇾" },
  { value: "QA", label: "Qatar", emoji: "🇶🇦" },
  { value: "RE", label: "Réunion", emoji: "🇷🇪" },
  { value: "RO", label: "Romania", emoji: "🇷🇴" },
  { value: "RS", label: "Serbia", emoji: "🇷🇸" },
  { value: "RU", label: "Russian Federation", emoji: "🇷🇺" },
  { value: "RW", label: "Rwanda", emoji: "🇷🇼" },
  { value: "SA", label: "Saudi Arabia", emoji: "🇸🇦" },
  { value: "SB", label: "Solomon Islands", emoji: "🇸🇧" },
  { value: "SC", label: "Seychelles", emoji: "🇸🇨" },
  { value: "SD", label: "Sudan", emoji: "🇸🇩" },
  { value: "SE", label: "Sweden", emoji: "🇸🇪" },
  { value: "SG", label: "Singapore", emoji: "🇸🇬" },
  {
    value: "SH",
    label: "Saint Helena, Ascension and Tristan da Cunha",
    emoji: "🇸🇭",
  },
  { value: "SI", label: "Slovenia", emoji: "🇸🇮" },
  { value: "SJ", label: "Svalbard and Jan Mayen", emoji: "🇸🇯" },
  { value: "SK", label: "Slovakia", emoji: "🇸🇰" },
  { value: "SL", label: "Sierra Leone", emoji: "🇸🇱" },
  { value: "SM", label: "San Marino", emoji: "🇸🇲" },
  { value: "SN", label: "Senegal", emoji: "🇸🇳" },
  { value: "SO", label: "Somalia", emoji: "🇸🇴" },
  { value: "SR", label: "Suriname", emoji: "🇸🇷" },
  { value: "SS", label: "South Sudan", emoji: "🇸🇸" },
  { value: "ST", label: "Sao Tome and Principe", emoji: "🇸🇹" },
  { value: "SV", label: "El Salvador", emoji: "🇸🇻" },
  { value: "SX", label: "Sint Maarten, (Dutch part)", emoji: "🇸🇽" },
  { value: "SY", label: "Syrian Arab Republic", emoji: "🇸🇾" },
  { value: "SZ", label: "Eswatini", emoji: "🇸🇿" },
  { value: "TC", label: "Turks and Caicos Islands", emoji: "🇹🇨" },
  { value: "TD", label: "Chad", emoji: "🇹🇩" },
  { value: "TF", label: "French Southern Territories", emoji: "🇹🇫" },
  { value: "TG", label: "Togo", emoji: "🇹🇬" },
  { value: "TH", label: "Thailand", emoji: "🇹🇭" },
  { value: "TJ", label: "Tajikistan", emoji: "🇹🇯" },
  { value: "TK", label: "Tokelau", emoji: "🇹🇰" },
  { value: "TL", label: "Timor-Leste", emoji: "🇹🇱" },
  { value: "TM", label: "Turkmenistan", emoji: "🇹🇲" },
  { value: "TN", label: "Tunisia", emoji: "🇹🇳" },
  { value: "TO", label: "Tonga", emoji: "🇹🇴" },
  { value: "TR", label: "Türkiye", emoji: "🇹🇷" },
  { value: "TT", label: "Trinidad and Tobago", emoji: "🇹🇹" },
  { value: "TV", label: "Tuvalu", emoji: "🇹🇻" },
  { value: "TW", label: "Taiwan, Province of China", emoji: "🇹🇼" },
  { value: "TZ", label: "Tanzania, United Republic of", emoji: "🇹🇿" },
  { value: "UA", label: "Ukraine", emoji: "🇺🇦" },
  { value: "UG", label: "Uganda", emoji: "🇺🇬" },
  { value: "UM", label: "United States Minor Outlying Islands", emoji: "🇺🇲" },
  { value: "US", label: "United States of America", emoji: "🇺🇸" },
  { value: "UY", label: "Uruguay", emoji: "🇺🇾" },
  { value: "UZ", label: "Uzbekistan", emoji: "🇺🇿" },
  { value: "VA", label: "Holy See", emoji: "🇻🇦" },
  { value: "VC", label: "Saint Vincent and the Grenadines", emoji: "🇻🇨" },
  { value: "VE", label: "Venezuela, Bolivarian Republic of", emoji: "🇻🇪" },
  { value: "VG", label: "Virgin Islands, British", emoji: "🇻🇬" },
  { value: "VI", label: "Virgin Islands, U.S.", emoji: "🇻🇮" },
  { value: "VN", label: "Viet Nam", emoji: "🇻🇳" },
  { value: "VU", label: "Vanuatu", emoji: "🇻🇺" },
  { value: "WF", label: "Wallis and Futuna", emoji: "🇼🇫" },
  { value: "WS", label: "Samoa", emoji: "🇼🇸" },
  { value: "YE", label: "Yemen", emoji: "🇾🇪" },
  { value: "YT", label: "Mayotte", emoji: "🇾🇹" },
  { value: "ZA", label: "South Africa", emoji: "🇿🇦" },
  { value: "ZM", label: "Zambia", emoji: "🇿🇲" },
  { value: "ZW", label: "Zimbabwe", emoji: "🇿🇼" },
]

```

### Virtualization

Alternatively, you can leverage virtualization from the
`@tanstack/react-virtual` package to render large datasets efficiently.

```tsx
"use client"

import {
  Combobox,
  Portal,
  useFilter,
  useListCollection,
} from "@chakra-ui/react"
import { useVirtualizer } from "@tanstack/react-virtual"
import { useRef } from "react"
import { flushSync } from "react-dom"

export const ComboboxVirtualized = () => {
  const contentRef = useRef<HTMLDivElement>(null)

  const { startsWith } = useFilter({ sensitivity: "base" })

  const { collection, filter, reset } = useListCollection({
    initialItems: items,
    filter: startsWith,
  })

  const virtualizer = useVirtualizer({
    count: collection.size,
    getScrollElement: () => contentRef.current,
    estimateSize: () => 28,
    overscan: 10,
    scrollPaddingEnd: 32,
  })

  const handleScrollToIndexFn = (details: { index: number }) => {
    flushSync(() => {
      virtualizer.scrollToIndex(details.index, {
        align: "center",
        behavior: "auto",
      })
    })
  }

  return (
    <Combobox.Root
      collection={collection}
      onInputValueChange={(e) => filter(e.inputValue)}
      scrollToIndexFn={handleScrollToIndexFn}
      width="320px"
    >
      <Combobox.Label>Select framework</Combobox.Label>
      <Combobox.Control>
        <Combobox.Input placeholder="Type to search" />
        <Combobox.IndicatorGroup>
          <Combobox.ClearTrigger />
          <Combobox.Trigger onClick={reset} />
        </Combobox.IndicatorGroup>
      </Combobox.Control>
      <Portal>
        <Combobox.Positioner>
          <Combobox.Content ref={contentRef}>
            <div
              style={{
                height: `${virtualizer.getTotalSize()}px`,
                width: "100%",
                position: "relative",
              }}
            >
              {virtualizer.getVirtualItems().map((virtualItem) => {
                const item = collection.items[virtualItem.index]
                return (
                  <Combobox.Item
                    key={item.value}
                    item={item}
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: `${virtualItem.size}px`,
                      transform: `translateY(${virtualItem.start}px)`,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    <Combobox.ItemText truncate>
                      <span aria-hidden style={{ marginRight: 4 }}>
                        {item.emoji}
                      </span>
                      {item.label}
                    </Combobox.ItemText>
                    <Combobox.ItemIndicator />
                  </Combobox.Item>
                )
              })}
            </div>
          </Combobox.Content>
        </Combobox.Positioner>
      </Portal>
    </Combobox.Root>
  )
}

export const items = [
  { value: "AD", label: "Andorra", emoji: "🇦🇩" },
  { value: "AE", label: "United Arab Emirates", emoji: "🇦🇪" },
  { value: "AF", label: "Afghanistan", emoji: "🇦🇫" },
  { value: "AG", label: "Antigua and Barbuda", emoji: "🇦🇬" },
  { value: "AI", label: "Anguilla", emoji: "🇦🇮" },
  { value: "AL", label: "Albania", emoji: "🇦🇱" },
  { value: "AM", label: "Armenia", emoji: "🇦🇲" },
  { value: "AO", label: "Angola", emoji: "🇦🇴" },
  { value: "AQ", label: "Antarctica", emoji: "🇦🇶" },
  { value: "AR", label: "Argentina", emoji: "🇦🇷" },
  { value: "AS", label: "American Samoa", emoji: "🇦🇸" },
  { value: "AT", label: "Austria", emoji: "🇦🇹" },
  { value: "AU", label: "Australia", emoji: "🇦🇺" },
  { value: "AW", label: "Aruba", emoji: "🇦🇼" },
  { value: "AX", label: "Åland Islands", emoji: "🇦🇽" },
  { value: "AZ", label: "Azerbaijan", emoji: "🇦🇿" },
  { value: "BA", label: "Bosnia and Herzegovina", emoji: "🇧🇦" },
  { value: "BB", label: "Barbados", emoji: "🇧🇧" },
  { value: "BD", label: "Bangladesh", emoji: "🇧🇩" },
  { value: "BE", label: "Belgium", emoji: "🇧🇪" },
  { value: "BF", label: "Burkina Faso", emoji: "🇧🇫" },
  { value: "BG", label: "Bulgaria", emoji: "🇧🇬" },
  { value: "BH", label: "Bahrain", emoji: "🇧🇭" },
  { value: "BI", label: "Burundi", emoji: "🇧🇮" },
  { value: "BJ", label: "Benin", emoji: "🇧🇯" },
  { value: "BL", label: "Saint Barthélemy", emoji: "🇧🇱" },
  { value: "BM", label: "Bermuda", emoji: "🇧🇲" },
  { value: "BN", label: "Brunei Darussalam", emoji: "🇧🇳" },
  { value: "BO", label: "Bolivia, Plurinational State of", emoji: "🇧🇴" },
  { value: "BQ", label: "Bonaire, Sint Eustatius and Saba", emoji: "🇧🇶" },
  { value: "BR", label: "Brazil", emoji: "🇧🇷" },
  { value: "BS", label: "Bahamas", emoji: "🇧🇸" },
  { value: "BT", label: "Bhutan", emoji: "🇧🇹" },
  { value: "BV", label: "Bouvet Island", emoji: "🇧🇻" },
  { value: "BW", label: "Botswana", emoji: "🇧🇼" },
  { value: "BY", label: "Belarus", emoji: "🇧🇾" },
  { value: "BZ", label: "Belize", emoji: "🇧🇿" },
  { value: "CA", label: "Canada", emoji: "🇨🇦" },
  { value: "CC", label: "Cocos (Keeling) Islands", emoji: "🇨🇨" },
  { value: "CD", label: "Congo, Democratic Republic of the", emoji: "🇨🇩" },
  { value: "CF", label: "Central African Republic", emoji: "🇨🇫" },
  { value: "CG", label: "Congo", emoji: "🇨🇬" },
  { value: "CH", label: "Switzerland", emoji: "🇨🇭" },
  { value: "CI", label: "Côte d'Ivoire", emoji: "🇨🇮" },
  { value: "CK", label: "Cook Islands", emoji: "🇨🇰" },
  { value: "CL", label: "Chile", emoji: "🇨🇱" },
  { value: "CM", label: "Cameroon", emoji: "🇨🇲" },
  { value: "CN", label: "China", emoji: "🇨🇳" },
  { value: "CO", label: "Colombia", emoji: "🇨🇴" },
  { value: "CR", label: "Costa Rica", emoji: "🇨🇷" },
  { value: "CU", label: "Cuba", emoji: "🇨🇺" },
  { value: "CV", label: "Cabo Verde", emoji: "🇨🇻" },
  { value: "CW", label: "Curaçao", emoji: "🇨🇼" },
  { value: "CX", label: "Christmas Island", emoji: "🇨🇽" },
  { value: "CY", label: "Cyprus", emoji: "🇨🇾" },
  { value: "CZ", label: "Czechia", emoji: "🇨🇿" },
  { value: "DE", label: "Germany", emoji: "🇩🇪" },
  { value: "DJ", label: "Djibouti", emoji: "🇩🇯" },
  { value: "DK", label: "Denmark", emoji: "🇩🇰" },
  { value: "DM", label: "Dominica", emoji: "🇩🇲" },
  { value: "DO", label: "Dominican Republic", emoji: "🇩🇴" },
  { value: "DZ", label: "Algeria", emoji: "🇩🇿" },
  { value: "EC", label: "Ecuador", emoji: "🇪🇨" },
  { value: "EE", label: "Estonia", emoji: "🇪🇪" },
  { value: "EG", label: "Egypt", emoji: "🇪🇬" },
  { value: "EH", label: "Western Sahara", emoji: "🇪🇭" },
  { value: "ER", label: "Eritrea", emoji: "🇪🇷" },
  { value: "ES", label: "Spain", emoji: "🇪🇸" },
  { value: "ET", label: "Ethiopia", emoji: "🇪🇹" },
  { value: "FI", label: "Finland", emoji: "🇫🇮" },
  { value: "FJ", label: "Fiji", emoji: "🇫🇯" },
  { value: "FK", label: "Falkland Islands (Malvinas)", emoji: "🇫🇰" },
  { value: "FM", label: "Micronesia, Federated States of", emoji: "🇫🇲" },
  { value: "FO", label: "Faroe Islands", emoji: "🇫🇴" },
  { value: "FR", label: "France", emoji: "🇫🇷" },
  { value: "GA", label: "Gabon", emoji: "🇬🇦" },
  {
    value: "GB",
    label: "United Kingdom of Great Britain and Northern Ireland",
    emoji: "🇬🇧",
  },
  { value: "GD", label: "Grenada", emoji: "🇬🇩" },
  { value: "GE", label: "Georgia", emoji: "🇬🇪" },
  { value: "GF", label: "French Guiana", emoji: "🇬🇫" },
  { value: "GG", label: "Guernsey", emoji: "🇬🇬" },
  { value: "GH", label: "Ghana", emoji: "🇬🇭" },
  { value: "GI", label: "Gibraltar", emoji: "🇬🇮" },
  { value: "GL", label: "Greenland", emoji: "🇬🇱" },
  { value: "GM", label: "Gambia", emoji: "🇬🇲" },
  { value: "GN", label: "Guinea", emoji: "🇬🇳" },
  { value: "GP", label: "Guadeloupe", emoji: "🇬🇵" },
  { value: "GQ", label: "Equatorial Guinea", emoji: "🇬🇶" },
  { value: "GR", label: "Greece", emoji: "🇬🇷" },
  {
    value: "GS",
    label: "South Georgia and the South Sandwich Islands",
    emoji: "🇬🇸",
  },
  { value: "GT", label: "Guatemala", emoji: "🇬🇹" },
  { value: "GU", label: "Guam", emoji: "🇬🇺" },
  { value: "GW", label: "Guinea-Bissau", emoji: "🇬🇼" },
  { value: "GY", label: "Guyana", emoji: "🇬🇾" },
  { value: "HK", label: "Hong Kong", emoji: "🇭🇰" },
  { value: "HM", label: "Heard Island and McDonald Islands", emoji: "🇭🇲" },
  { value: "HN", label: "Honduras", emoji: "🇭🇳" },
  { value: "HR", label: "Croatia", emoji: "🇭🇷" },
  { value: "HT", label: "Haiti", emoji: "🇭🇹" },
  { value: "HU", label: "Hungary", emoji: "🇭🇺" },
  { value: "ID", label: "Indonesia", emoji: "🇮🇩" },
  { value: "IE", label: "Ireland", emoji: "🇮🇪" },
  { value: "IL", label: "Israel", emoji: "🇮🇱" },
  { value: "IM", label: "Isle of Man", emoji: "🇮🇲" },
  { value: "IN", label: "India", emoji: "🇮🇳" },
  { value: "IO", label: "British Indian Ocean Territory", emoji: "🇮🇴" },
  { value: "IQ", label: "Iraq", emoji: "🇮🇶" },
  { value: "IR", label: "Iran, Islamic Republic of", emoji: "🇮🇷" },
  { value: "IS", label: "Iceland", emoji: "🇮🇸" },
  { value: "IT", label: "Italy", emoji: "🇮🇹" },
  { value: "JE", label: "Jersey", emoji: "🇯🇪" },
  { value: "JM", label: "Jamaica", emoji: "🇯🇲" },
  { value: "JO", label: "Jordan", emoji: "🇯🇴" },
  { value: "JP", label: "Japan", emoji: "🇯🇵" },
  { value: "KE", label: "Kenya", emoji: "🇰🇪" },
  { value: "KG", label: "Kyrgyzstan", emoji: "🇰🇬" },
  { value: "KH", label: "Cambodia", emoji: "🇰🇭" },
  { value: "KI", label: "Kiribati", emoji: "🇰🇮" },
  { value: "KM", label: "Comoros", emoji: "🇰🇲" },
  { value: "KN", label: "Saint Kitts and Nevis", emoji: "🇰🇳" },
  { value: "KP", label: "Korea, Democratic People's Republic of", emoji: "🇰🇵" },
  { value: "KR", label: "Korea, Republic of", emoji: "🇰🇷" },
  { value: "KW", label: "Kuwait", emoji: "🇰🇼" },
  { value: "KY", label: "Cayman Islands", emoji: "🇰🇾" },
  { value: "KZ", label: "Kazakhstan", emoji: "🇰🇿" },
  { value: "LA", label: "Lao People's Democratic Republic", emoji: "🇱🇦" },
  { value: "LB", label: "Lebanon", emoji: "🇱🇧" },
  { value: "LC", label: "Saint Lucia", emoji: "🇱🇨" },
  { value: "LI", label: "Liechtenstein", emoji: "🇱🇮" },
  { value: "LK", label: "Sri Lanka", emoji: "🇱🇰" },
  { value: "LR", label: "Liberia", emoji: "🇱🇷" },
  { value: "LS", label: "Lesotho", emoji: "🇱🇸" },
  { value: "LT", label: "Lithuania", emoji: "🇱🇹" },
  { value: "LU", label: "Luxembourg", emoji: "🇱🇺" },
  { value: "LV", label: "Latvia", emoji: "🇱🇻" },
  { value: "LY", label: "Libya", emoji: "🇱🇾" },
  { value: "MA", label: "Morocco", emoji: "🇲🇦" },
  { value: "MC", label: "Monaco", emoji: "🇲🇨" },
  { value: "MD", label: "Moldova, Republic of", emoji: "🇲🇩" },
  { value: "ME", label: "Montenegro", emoji: "🇲🇪" },
  { value: "MF", label: "Saint Martin, (French part)", emoji: "🇲🇫" },
  { value: "MG", label: "Madagascar", emoji: "🇲🇬" },
  { value: "MH", label: "Marshall Islands", emoji: "🇲🇭" },
  { value: "MK", label: "North Macedonia", emoji: "🇲🇰" },
  { value: "ML", label: "Mali", emoji: "🇲🇱" },
  { value: "MM", label: "Myanmar", emoji: "🇲🇲" },
  { value: "MN", label: "Mongolia", emoji: "🇲🇳" },
  { value: "MO", label: "Macao", emoji: "🇲🇴" },
  { value: "MP", label: "Northern Mariana Islands", emoji: "🇲🇵" },
  { value: "MQ", label: "Martinique", emoji: "🇲🇶" },
  { value: "MR", label: "Mauritania", emoji: "🇲🇷" },
  { value: "MS", label: "Montserrat", emoji: "🇲🇸" },
  { value: "MT", label: "Malta", emoji: "🇲🇹" },
  { value: "MU", label: "Mauritius", emoji: "🇲🇺" },
  { value: "MV", label: "Maldives", emoji: "🇲🇻" },
  { value: "MW", label: "Malawi", emoji: "🇲🇼" },
  { value: "MX", label: "Mexico", emoji: "🇲🇽" },
  { value: "MY", label: "Malaysia", emoji: "🇲🇾" },
  { value: "MZ", label: "Mozambique", emoji: "🇲🇿" },
  { value: "NA", label: "Namibia", emoji: "🇳🇦" },
  { value: "NC", label: "New Caledonia", emoji: "🇳🇨" },
  { value: "NE", label: "Niger", emoji: "🇳🇪" },
  { value: "NF", label: "Norfolk Island", emoji: "🇳🇫" },
  { value: "NG", label: "Nigeria", emoji: "🇳🇬" },
  { value: "NI", label: "Nicaragua", emoji: "🇳🇮" },
  { value: "NL", label: "Netherlands", emoji: "🇳🇱" },
  { value: "NO", label: "Norway", emoji: "🇳🇴" },
  { value: "NP", label: "Nepal", emoji: "🇳🇵" },
  { value: "NR", label: "Nauru", emoji: "🇳🇷" },
  { value: "NU", label: "Niue", emoji: "🇳🇺" },
  { value: "NZ", label: "New Zealand", emoji: "🇳🇿" },
  { value: "OM", label: "Oman", emoji: "🇴🇲" },
  { value: "PA", label: "Panama", emoji: "🇵🇦" },
  { value: "PE", label: "Peru", emoji: "🇵🇪" },
  { value: "PF", label: "French Polynesia", emoji: "🇵🇫" },
  { value: "PG", label: "Papua New Guinea", emoji: "🇵🇬" },
  { value: "PH", label: "Philippines", emoji: "🇵🇭" },
  { value: "PK", label: "Pakistan", emoji: "🇵🇰" },
  { value: "PL", label: "Poland", emoji: "🇵🇱" },
  { value: "PM", label: "Saint Pierre and Miquelon", emoji: "🇵🇲" },
  { value: "PN", label: "Pitcairn", emoji: "🇵🇳" },
  { value: "PR", label: "Puerto Rico", emoji: "🇵🇷" },
  { value: "PS", label: "Palestine, State of", emoji: "🇵🇸" },
  { value: "PT", label: "Portugal", emoji: "🇵🇹" },
  { value: "PW", label: "Palau", emoji: "🇵🇼" },
  { value: "PY", label: "Paraguay", emoji: "🇵🇾" },
  { value: "QA", label: "Qatar", emoji: "🇶🇦" },
  { value: "RE", label: "Réunion", emoji: "🇷🇪" },
  { value: "RO", label: "Romania", emoji: "🇷🇴" },
  { value: "RS", label: "Serbia", emoji: "🇷🇸" },
  { value: "RU", label: "Russian Federation", emoji: "🇷🇺" },
  { value: "RW", label: "Rwanda", emoji: "🇷🇼" },
  { value: "SA", label: "Saudi Arabia", emoji: "🇸🇦" },
  { value: "SB", label: "Solomon Islands", emoji: "🇸🇧" },
  { value: "SC", label: "Seychelles", emoji: "🇸🇨" },
  { value: "SD", label: "Sudan", emoji: "🇸🇩" },
  { value: "SE", label: "Sweden", emoji: "🇸🇪" },
  { value: "SG", label: "Singapore", emoji: "🇸🇬" },
  {
    value: "SH",
    label: "Saint Helena, Ascension and Tristan da Cunha",
    emoji: "🇸🇭",
  },
  { value: "SI", label: "Slovenia", emoji: "🇸🇮" },
  { value: "SJ", label: "Svalbard and Jan Mayen", emoji: "🇸🇯" },
  { value: "SK", label: "Slovakia", emoji: "🇸🇰" },
  { value: "SL", label: "Sierra Leone", emoji: "🇸🇱" },
  { value: "SM", label: "San Marino", emoji: "🇸🇲" },
  { value: "SN", label: "Senegal", emoji: "🇸🇳" },
  { value: "SO", label: "Somalia", emoji: "🇸🇴" },
  { value: "SR", label: "Suriname", emoji: "🇸🇷" },
  { value: "SS", label: "South Sudan", emoji: "🇸🇸" },
  { value: "ST", label: "Sao Tome and Principe", emoji: "🇸🇹" },
  { value: "SV", label: "El Salvador", emoji: "🇸🇻" },
  { value: "SX", label: "Sint Maarten, (Dutch part)", emoji: "🇸🇽" },
  { value: "SY", label: "Syrian Arab Republic", emoji: "🇸🇾" },
  { value: "SZ", label: "Eswatini", emoji: "🇸🇿" },
  { value: "TC", label: "Turks and Caicos Islands", emoji: "🇹🇨" },
  { value: "TD", label: "Chad", emoji: "🇹🇩" },
  { value: "TF", label: "French Southern Territories", emoji: "🇹🇫" },
  { value: "TG", label: "Togo", emoji: "🇹🇬" },
  { value: "TH", label: "Thailand", emoji: "🇹🇭" },
  { value: "TJ", label: "Tajikistan", emoji: "🇹🇯" },
  { value: "TK", label: "Tokelau", emoji: "🇹🇰" },
  { value: "TL", label: "Timor-Leste", emoji: "🇹🇱" },
  { value: "TM", label: "Turkmenistan", emoji: "🇹🇲" },
  { value: "TN", label: "Tunisia", emoji: "🇹🇳" },
  { value: "TO", label: "Tonga", emoji: "🇹🇴" },
  { value: "TR", label: "Türkiye", emoji: "🇹🇷" },
  { value: "TT", label: "Trinidad and Tobago", emoji: "🇹🇹" },
  { value: "TV", label: "Tuvalu", emoji: "🇹🇻" },
  { value: "TW", label: "Taiwan, Province of China", emoji: "🇹🇼" },
  { value: "TZ", label: "Tanzania, United Republic of", emoji: "🇹🇿" },
  { value: "UA", label: "Ukraine", emoji: "🇺🇦" },
  { value: "UG", label: "Uganda", emoji: "🇺🇬" },
  { value: "UM", label: "United States Minor Outlying Islands", emoji: "🇺🇲" },
  { value: "US", label: "United States of America", emoji: "🇺🇸" },
  { value: "UY", label: "Uruguay", emoji: "🇺🇾" },
  { value: "UZ", label: "Uzbekistan", emoji: "🇺🇿" },
  { value: "VA", label: "Holy See", emoji: "🇻🇦" },
  { value: "VC", label: "Saint Vincent and the Grenadines", emoji: "🇻🇨" },
  { value: "VE", label: "Venezuela, Bolivarian Republic of", emoji: "🇻🇪" },
  { value: "VG", label: "Virgin Islands, British", emoji: "🇻🇬" },
  { value: "VI", label: "Virgin Islands, U.S.", emoji: "🇻🇮" },
  { value: "VN", label: "Viet Nam", emoji: "🇻🇳" },
  { value: "VU", label: "Vanuatu", emoji: "🇻🇺" },
  { value: "WF", label: "Wallis and Futuna", emoji: "🇼🇫" },
  { value: "WS", label: "Samoa", emoji: "🇼🇸" },
  { value: "YE", label: "Yemen", emoji: "🇾🇪" },
  { value: "YT", label: "Mayotte", emoji: "🇾🇹" },
  { value: "ZA", label: "South Africa", emoji: "🇿🇦" },
  { value: "ZM", label: "Zambia", emoji: "🇿🇲" },
  { value: "ZW", label: "Zimbabwe", emoji: "🇿🇼" },
]

```

### Links

Use the `asChild` prop to render the combobox items as links.

```tsx
"use client"

import {
  Combobox,
  Portal,
  useFilter,
  useListCollection,
} from "@chakra-ui/react"
import { LuExternalLink } from "react-icons/lu"

export const ComboboxWithLinks = () => {
  const { contains } = useFilter({ sensitivity: "base" })

  const { collection, filter } = useListCollection({
    initialItems: frameworks,
    filter: contains,
  })

  return (
    <Combobox.Root
      collection={collection}
      onInputValueChange={(e) => filter(e.inputValue)}
      width="320px"
      selectionBehavior="clear"
    >
      <Combobox.Label>Select framework</Combobox.Label>
      <Combobox.Control>
        <Combobox.Input placeholder="Type to search" />
        <Combobox.IndicatorGroup>
          <Combobox.ClearTrigger />
          <Combobox.Trigger />
        </Combobox.IndicatorGroup>
      </Combobox.Control>
      <Portal>
        <Combobox.Positioner>
          <Combobox.Content>
            <Combobox.Empty>No items found</Combobox.Empty>
            {collection.items.map((item) => (
              <Combobox.Item asChild item={item} key={item.value}>
                <a href={item.docs}>
                  {item.label} <LuExternalLink size={10} />
                </a>
              </Combobox.Item>
            ))}
          </Combobox.Content>
        </Combobox.Positioner>
      </Portal>
    </Combobox.Root>
  )
}

const frameworks = [
  { label: "React", value: "react", docs: "https://react.dev" },
  { label: "Solid", value: "solid", docs: "https://solidjs.com" },
  { label: "Vue", value: "vue", docs: "https://vuejs.org" },
  { label: "Angular", value: "angular", docs: "https://angular.io" },
  { label: "Svelte", value: "svelte", docs: "https://svelte.dev" },
  { label: "Preact", value: "preact", docs: "https://preactjs.com" },
  { label: "Qwik", value: "qwik", docs: "https://qwik.builder.io" },
  { label: "Lit", value: "lit", docs: "https://lit.dev" },
  { label: "Alpine.js", value: "alpinejs", docs: "https://alpinejs.dev" },
  { label: "Ember", value: "ember", docs: "https://emberjs.com" },
  { label: "Next.js", value: "nextjs", docs: "https://nextjs.org" },
]

```

For custom router links, you can customize the `navigate` prop on the
`Combobox.Root` component.

Here's an example of using the Tanstack Router.

```tsx {8-10}
import { Combobox } from "@chakra-ui/react"
import { useNavigate } from "@tanstack/react-router"

function Demo() {
  const navigate = useNavigate()
  return (
    <Combobox.Root
      navigate={({ href }) => {
        navigate({ to: href })
      }}
    >
      {/* ... */}
    </Combobox.Root>
  )
}
```

### Rehydrate Value

In some cases, where a combobox has a `defaultValue` but the collection is not
loaded yet, here's an example of how to rehydrate the value and populate the
input value.

```tsx
"use client"

import {
  Combobox,
  For,
  HStack,
  Portal,
  Span,
  Spinner,
  useCombobox,
  useListCollection,
} from "@chakra-ui/react"
import { useRef, useState } from "react"
import { useAsync } from "react-use"

export const ComboboxRehydrateValue = () => {
  const [inputValue, setInputValue] = useState("")

  const { collection, set } = useListCollection<Character>({
    initialItems: [],
    itemToString: (item) => item.name,
    itemToValue: (item) => item.name,
  })

  const combobox = useCombobox({
    collection,
    defaultValue: ["C-3PO"],
    placeholder: "Example: Dexter",
    inputValue,
    onInputValueChange: (e) => setInputValue(e.inputValue),
  })

  const state = useAsync(async () => {
    const response = await fetch(
      `https://swapi.py4e.com/api/people/?search=${inputValue}`,
    )
    const data = await response.json()
    set(data.results)
  }, [inputValue, set])

  // Rehydrate the value
  const hydrated = useRef(false)
  if (combobox.value.length && collection.size && !hydrated.current) {
    combobox.syncSelectedItems()
    hydrated.current = true
  }

  return (
    <Combobox.RootProvider value={combobox} width="320px">
      <Combobox.Label>Search Star Wars Characters</Combobox.Label>

      <Combobox.Control>
        <Combobox.Input placeholder="Type to search" />
      </Combobox.Control>

      <Portal>
        <Combobox.Positioner>
          <Combobox.Content>
            {state.loading ? (
              <HStack p="2">
                <Spinner size="xs" />
                <Span>Loading...</Span>
              </HStack>
            ) : state.error ? (
              <Span p="2" color="fg.error">
                {state.error.message}
              </Span>
            ) : (
              <For
                each={collection.items}
                fallback={<Combobox.Empty>No items</Combobox.Empty>}
              >
                {(item) => (
                  <Combobox.Item key={item.name} item={item}>
                    <HStack justify="space-between" textStyle="sm">
                      <Span fontWeight="medium">{item.name}</Span>
                      <Span color="fg.muted">
                        {item.height}cm / {item.mass}kg
                      </Span>
                    </HStack>
                    <Combobox.ItemIndicator />
                  </Combobox.Item>
                )}
              </For>
            )}
          </Combobox.Content>
        </Combobox.Positioner>
      </Portal>
    </Combobox.RootProvider>
  )
}

interface Character {
  name: string
  height: string
  mass: string
  created: string
  edited: string
  url: string
}

```

### Custom Item

Customize the appearance of items in the dropdown with your own components.

```tsx
"use client"

import {
  Combobox,
  HStack,
  Image,
  Portal,
  Span,
  Stack,
  useComboboxContext,
  useFilter,
  useListCollection,
} from "@chakra-ui/react"

function ComboboxValue() {
  const combobox = useComboboxContext()
  const selectedItems = combobox.selectedItems as (typeof items)[number][]
  return (
    <Stack mt="2">
      {selectedItems.map((item) => (
        <HStack key={item.value} textStyle="sm" p="1" borderWidth="1px">
          <Image
            boxSize="10"
            p="2"
            src={item.logo}
            alt={item.label + " logo"}
          />
          <span>{item.label}</span>
        </HStack>
      ))}
    </Stack>
  )
}

export const ComboboxWithCustomItem = () => {
  const { contains } = useFilter({ sensitivity: "base" })

  const { collection, filter } = useListCollection({
    initialItems: items,
    filter: contains,
  })

  return (
    <Combobox.Root
      collection={collection}
      onInputValueChange={(e) => filter(e.inputValue)}
      width="320px"
      placeholder="Example: Audi"
      multiple
      closeOnSelect
    >
      <Combobox.Label>Search and select car brands</Combobox.Label>
      <Combobox.Control>
        <Combobox.Input />
        <Combobox.IndicatorGroup>
          <Combobox.Trigger />
        </Combobox.IndicatorGroup>
      </Combobox.Control>
      <ComboboxValue />
      <Portal>
        <Combobox.Positioner>
          <Combobox.Content>
            <Combobox.Empty>No items found</Combobox.Empty>
            {collection.items.map((item) => (
              <Combobox.Item item={item} key={item.value}>
                <Image boxSize="5" src={item.logo} alt={item.label + " logo"} />
                <Span flex="1">{item.label}</Span>
                <Combobox.ItemIndicator />
              </Combobox.Item>
            ))}
          </Combobox.Content>
        </Combobox.Positioner>
      </Portal>
    </Combobox.Root>
  )
}

export const items = [
  {
    label: "Audi",
    value: "audi",
    logo: "https://s3.amazonaws.com/cdn.formk.it/example-assets/car-brands/audi-logo.png",
  },
  {
    label: "BMW",
    value: "bmw",
    logo: "https://s3.amazonaws.com/cdn.formk.it/example-assets/car-brands/bmw-logo.png",
  },
  {
    label: "Citroen",
    value: "citroen",
    logo: "https://s3.amazonaws.com/cdn.formk.it/example-assets/car-brands/citroen-logo.png",
  },
  {
    label: "Dacia",
    value: "dacia",
    logo: "https://s3.amazonaws.com/cdn.formk.it/example-assets/car-brands/dacia-logo.png",
  },
  {
    label: "Fiat",
    value: "fiat",
    logo: "https://s3.amazonaws.com/cdn.formk.it/example-assets/car-brands/fiat-logo.png",
  },
  {
    label: "Ford",
    value: "ford",
    logo: "https://s3.amazonaws.com/cdn.formk.it/example-assets/car-brands/ford-logo.png",
  },
  {
    label: "Ferrari",
    value: "ferrari",
    logo: "https://s3.amazonaws.com/cdn.formk.it/example-assets/car-brands/ferrari-logo.png",
  },
  {
    label: "Honda",
    value: "honda",
    logo: "https://s3.amazonaws.com/cdn.formk.it/example-assets/car-brands/honda-logo.png",
  },
  {
    label: "Hyundai",
    value: "hyundai",
    logo: "https://s3.amazonaws.com/cdn.formk.it/example-assets/car-brands/hyundai-logo.png",
  },
  {
    label: "Jaguar",
    value: "jaguar",
    logo: "https://s3.amazonaws.com/cdn.formk.it/example-assets/car-brands/jaguar-logo.png",
  },
  {
    label: "Jeep",
    value: "jeep",
    logo: "https://s3.amazonaws.com/cdn.formk.it/example-assets/car-brands/jeep-logo.png",
  },
  {
    label: "Kia",
    value: "kia",
    logo: "https://s3.amazonaws.com/cdn.formk.it/example-assets/car-brands/kia-logo.png",
  },
  {
    label: "Land Rover",
    value: "land rover",
    logo: "https://s3.amazonaws.com/cdn.formk.it/example-assets/car-brands/land-rover-logo.png",
  },
  {
    label: "Mazda",
    value: "mazda",
    logo: "https://s3.amazonaws.com/cdn.formk.it/example-assets/car-brands/mazda-logo.png",
  },
  {
    label: "Mercedes",
    value: "mercedes",
    logo: "https://s3.amazonaws.com/cdn.formk.it/example-assets/car-brands/mercedes-logo.png",
  },
  {
    label: "Mini",
    value: "mini",
    logo: "https://s3.amazonaws.com/cdn.formk.it/example-assets/car-brands/mini-logo.png",
  },
  {
    label: "Mitsubishi",
    value: "mitsubishi",
    logo: "https://s3.amazonaws.com/cdn.formk.it/example-assets/car-brands/mitsubishi-logo.png",
  },
  {
    label: "Nissan",
    value: "nissan",
    logo: "https://s3.amazonaws.com/cdn.formk.it/example-assets/car-brands/nissan-logo.png",
  },
  {
    label: "Opel",
    value: "opel",
    logo: "https://s3.amazonaws.com/cdn.formk.it/example-assets/car-brands/opel-logo.png",
  },
  {
    label: "Peugeot",
    value: "peugeot",
    logo: "https://s3.amazonaws.com/cdn.formk.it/example-assets/car-brands/peugeot-logo.png",
  },
  {
    label: "Porsche",
    value: "porsche",
    logo: "https://s3.amazonaws.com/cdn.formk.it/example-assets/car-brands/porsche-logo.png",
  },
  {
    label: "Renault",
    value: "renault",
    logo: "https://s3.amazonaws.com/cdn.formk.it/example-assets/car-brands/renault-logo.png",
  },
  {
    label: "Saab",
    value: "saab",
    logo: "https://s3.amazonaws.com/cdn.formk.it/example-assets/car-brands/saab-logo.png",
  },
  {
    label: "Skoda",
    value: "skoda",
    logo: "https://s3.amazonaws.com/cdn.formk.it/example-assets/car-brands/skoda-logo.png",
  },
  {
    label: "Subaru",
    value: "subaru",
    logo: "https://s3.amazonaws.com/cdn.formk.it/example-assets/car-brands/subaru-logo.png",
  },
  {
    label: "Suzuki",
    value: "suzuki",
    logo: "https://s3.amazonaws.com/cdn.formk.it/example-assets/car-brands/suzuki-logo.png",
  },
  {
    label: "Toyota",
    value: "toyota",
    logo: "https://s3.amazonaws.com/cdn.formk.it/example-assets/car-brands/toyota-logo.png",
  },
  {
    label: "Volkswagen",
    value: "volkswagen",
    logo: "https://s3.amazonaws.com/cdn.formk.it/example-assets/car-brands/volkswagen-logo.png",
  },
  {
    label: "Volvo",
    value: "volvo",
    logo: "https://s3.amazonaws.com/cdn.formk.it/example-assets/car-brands/volvo-logo.png",
  },
]

```

### Custom Filter

Here's an example of a custom filter that matches multiple properties of an
item.

```tsx
"use client"

import {
  Combobox,
  Portal,
  Span,
  Stack,
  useListCollection,
} from "@chakra-ui/react"

export const ComboboxWithCustomFilter = () => {
  const { collection, set } = useListCollection({
    initialItems: people,
    itemToString: (item) => item.name,
    itemToValue: (item) => item.id.toString(),
  })

  const handleInputChange = (details: Combobox.InputValueChangeDetails) => {
    const filteredItems = people.filter((item) => {
      const searchLower = details.inputValue.toLowerCase()
      const nameParts = item.name.toLowerCase().split(" ")
      const emailParts = item.email.toLowerCase().split("@")[0].split(".")

      return (
        item.name.toLowerCase().includes(searchLower) ||
        nameParts.some((part) => part.includes(searchLower)) ||
        emailParts.some((part) => part.includes(searchLower)) ||
        item.role.toLowerCase().includes(searchLower)
      )
    })
    set(filteredItems)
  }

  return (
    <Combobox.Root
      width="320px"
      collection={collection}
      inputBehavior="autocomplete"
      placeholder="Search by name, email, or role..."
      onInputValueChange={handleInputChange}
    >
      <Combobox.Label>Select Person</Combobox.Label>

      <Combobox.Control>
        <Combobox.Input />
        <Combobox.IndicatorGroup>
          <Combobox.ClearTrigger />
          <Combobox.Trigger />
        </Combobox.IndicatorGroup>
      </Combobox.Control>

      <Portal>
        <Combobox.Positioner>
          <Combobox.Content>
            <Combobox.Empty>No matches found</Combobox.Empty>
            {collection.items.map((person) => (
              <Combobox.Item item={person} key={person.id}>
                <Stack gap={0}>
                  <Span textStyle="sm" fontWeight="medium">
                    {person.name}
                  </Span>
                  <Span textStyle="xs" color="fg.muted">
                    {person.email}
                  </Span>
                </Stack>
                <Combobox.ItemIndicator />
              </Combobox.Item>
            ))}
          </Combobox.Content>
        </Combobox.Positioner>
      </Portal>
    </Combobox.Root>
  )
}

const people = [
  {
    id: 1,
    name: "John Smith",
    email: "john@example.com",
    role: "Sales Manager",
  },
  {
    id: 2,
    name: "Sarah Johnson",
    email: "sarah@example.com",
    role: "UI Designer",
  },
  {
    id: 3,
    name: "Michael Brown",
    email: "michael@example.com",
    role: "Software Engineer",
  },
  {
    id: 4,
    name: "Emily Davis",
    email: "emily@example.com",
    role: "AI Engineer",
  },
  {
    id: 5,
    name: "James Wilson",
    email: "james@example.com",
    role: "Chief Executive Officer",
  },
]

```

### Custom Animation

To customize the animation of the combobox, pass the `_open` and `_closed` prop
to the `Combobox.Content` component.

```tsx
"use client"

import {
  Combobox,
  Portal,
  useFilter,
  useListCollection,
} from "@chakra-ui/react"

export const ComboboxWithCustomAnimation = () => {
  const { contains } = useFilter({ sensitivity: "base" })

  const { collection, filter } = useListCollection({
    initialItems: frameworks,
    filter: contains,
  })

  return (
    <Combobox.Root
      collection={collection}
      onInputValueChange={(e) => filter(e.inputValue)}
      width="320px"
      positioning={{ flip: false, gutter: 2 }}
    >
      <Combobox.Label>Select framework</Combobox.Label>
      <Combobox.Control>
        <Combobox.Input placeholder="Type to search" />
        <Combobox.IndicatorGroup>
          <Combobox.ClearTrigger />
          <Combobox.Trigger />
        </Combobox.IndicatorGroup>
      </Combobox.Control>
      <Portal>
        <Combobox.Positioner>
          <Combobox.Content
            _open={{ animationStyle: "scale-fade-in" }}
            _closed={{
              animationStyle: "scale-fade-out",
              animationDuration: "fast",
            }}
          >
            <Combobox.Empty>No items found</Combobox.Empty>
            {collection.items.map((item) => (
              <Combobox.Item item={item} key={item.value}>
                {item.label}
                <Combobox.ItemIndicator />
              </Combobox.Item>
            ))}
          </Combobox.Content>
        </Combobox.Positioner>
      </Portal>
    </Combobox.Root>
  )
}

const frameworks = [
  { label: "React", value: "react" },
  { label: "Solid", value: "solid" },
  { label: "Vue", value: "vue" },
  { label: "Angular", value: "angular" },
  { label: "Svelte", value: "svelte" },
  { label: "Preact", value: "preact" },
  { label: "Qwik", value: "qwik" },
  { label: "Lit", value: "lit" },
  { label: "Alpine.js", value: "alpinejs" },
  { label: "Ember", value: "ember" },
  { label: "Next.js", value: "nextjs" },
]

```

### Within Dialog

To use the combobox within a dialog or popover component, avoid wrapping the
`Combobox.Positioner` within the `Portal`.

```diff
-<Portal>
  <Combobox.Positioner>
    <Combobox.Content>
      {/* ... */}
    </Combobox.Content>
  </Combobox.Positioner>
-</Portal>
```

If you use a `Dialog` and have set `scrollBehavior="inside"`, you need to:

- Set the combobox positioning to `fixed` to avoid the combobox from being
  clipped by the dialog.
- Set `hideWhenDetached` to `true` to hide the combobox when the trigger is
  scrolled out of view.

```tsx
<Combobox.Root positioning={{ strategy: "fixed", hideWhenDetached: true }}>
  {/* ... */}
</Combobox.Root>
```

```tsx
"use client"

import {
  Button,
  Combobox,
  Popover,
  Portal,
  useFilter,
  useListCollection,
} from "@chakra-ui/react"

export const ComboboxInPopover = () => {
  return (
    <Popover.Root size="xs">
      <Popover.Trigger asChild>
        <Button variant="outline" size="sm">
          Toggle popover
        </Button>
      </Popover.Trigger>
      <Portal>
        <Popover.Positioner>
          <Popover.Content>
            <Popover.Header>Select framework</Popover.Header>
            <Popover.Body>
              <ComboboxDemo />
            </Popover.Body>
          </Popover.Content>
        </Popover.Positioner>
      </Portal>
    </Popover.Root>
  )
}

const ComboboxDemo = () => {
  const { contains } = useFilter({ sensitivity: "base" })

  const { collection, filter } = useListCollection({
    initialItems: frameworks,
    filter: contains,
  })

  return (
    <Combobox.Root
      collection={collection}
      onInputValueChange={(e) => filter(e.inputValue)}
    >
      <Combobox.Control>
        <Combobox.Input placeholder="Type to search" />
        <Combobox.IndicatorGroup>
          <Combobox.ClearTrigger />
          <Combobox.Trigger />
        </Combobox.IndicatorGroup>
      </Combobox.Control>
      <Combobox.Positioner>
        <Combobox.Content>
          <Combobox.Empty>No items found</Combobox.Empty>
          {collection.items.map((item) => (
            <Combobox.Item item={item} key={item.value}>
              {item.label}
              <Combobox.ItemIndicator />
            </Combobox.Item>
          ))}
        </Combobox.Content>
      </Combobox.Positioner>
    </Combobox.Root>
  )
}

const frameworks = [
  { label: "React", value: "react" },
  { label: "Solid", value: "solid" },
  { label: "Vue", value: "vue" },
  { label: "Angular", value: "angular" },
  { label: "Svelte", value: "svelte" },
  { label: "Preact", value: "preact" },
  { label: "Qwik", value: "qwik" },
  { label: "Lit", value: "lit" },
  { label: "Alpine.js", value: "alpinejs" },
  { label: "Ember", value: "ember" },
  { label: "Next.js", value: "nextjs" },
]

```

## Props

### Root

| Prop | Default | Type | Description |
| --- | --- | --- | --- |
| collection | undefined | `ListCollection<T>` | The collection of items |
| composite | true | `boolean` | Whether the combobox is a composed with other composite widgets like tabs |
| defaultInputValue | "" | `string` | The initial value of the combobox's input when rendered.
Use when you don't need to control the value of the combobox's input. |
| defaultValue | [] | `string[]` | The initial value of the combobox's selected items when rendered.
Use when you don't need to control the value of the combobox's selected items. |
| inputBehavior | "none" | `'none' \| 'autohighlight' \| 'autocomplete'` | Defines the auto-completion behavior of the combobox.

- `autohighlight`: The first focused item is highlighted as the user types
- `autocomplete`: Navigating the listbox with the arrow keys selects the item and the input is updated |
| lazyMount | false | `boolean` | Whether to enable lazy mounting |
| loopFocus | true | `boolean` | Whether to loop the keyboard navigation through the items |
| openOnChange | true | `boolean \| ((details: InputValueChangeDetails) => boolean)` | Whether to show the combobox when the input value changes |
| openOnClick | false | `boolean` | Whether to open the combobox popup on initial click on the input |
| openOnKeyPress | true | `boolean` | Whether to open the combobox on arrow key press |
| positioning | { placement: "bottom-start" } | `PositioningOptions` | The positioning options to dynamically position the menu |
| selectionBehavior | "replace" | `'replace' \| 'clear' \| 'preserve'` | The behavior of the combobox input when an item is selected

- `replace`: The selected item string is set as the input value
- `clear`: The input value is cleared
- `preserve`: The input value is preserved |
| skipAnimationOnMount | false | `boolean` | Whether to allow the initial presence animation. |
| unmountOnExit | false | `boolean` | Whether to unmount on exit. |
| colorPalette | gray | `'gray' \| 'red' \| 'orange' \| 'yellow' \| 'green' \| 'teal' \| 'blue' \| 'cyan' \| 'purple' \| 'pink'` | The color palette of the component |
| variant | outline | `'outline' \| 'subtle' \| 'flushed'` | The variant of the component |
| size | md | `'xs' \| 'sm' \| 'md' \| 'lg'` | The size of the component |
| as | undefined | `React.ElementType` | The underlying element to render. |
| asChild | undefined | `boolean` | Use the provided child element as the default rendered element, combining their props and behavior. |
| unstyled | undefined | `boolean` | Whether to remove the component's style. |
| allowCustomValue | undefined | `boolean` | Whether to allow typing custom values in the input |
| autoFocus | undefined | `boolean` | Whether to autofocus the input on mount |
| closeOnSelect | undefined | `boolean` | Whether to close the combobox when an item is selected. |
| defaultHighlightedValue | undefined | `string` | The initial highlighted value of the combobox when rendered.
Use when you don't need to control the highlighted value of the combobox. |
| defaultOpen | undefined | `boolean` | The initial open state of the combobox when rendered.
Use when you don't need to control the open state of the combobox. |
| disabled | undefined | `boolean` | Whether the combobox is disabled |
| disableLayer | undefined | `boolean` | Whether to disable registering this a dismissable layer |
| form | undefined | `string` | The associate form of the combobox. |
| highlightedValue | undefined | `string` | The controlled highlighted value of the combobox |
| id | undefined | `string` | The unique identifier of the machine. |
| ids | undefined | `Partial<{\n  root: string\n  label: string\n  control: string\n  input: string\n  content: string\n  trigger: string\n  clearTrigger: string\n  item: (id: string, index?: number \| undefined) => string\n  positioner: string\n  itemGroup: (id: string \| number) => string\n  itemGroupLabel: (id: string \| number) => string\n}>` | The ids of the elements in the combobox. Useful for composition. |
| immediate | undefined | `boolean` | Whether to synchronize the present change immediately or defer it to the next frame |
| inputValue | undefined | `string` | The controlled value of the combobox's input |
| invalid | undefined | `boolean` | Whether the combobox is invalid |
| multiple | undefined | `boolean` | Whether to allow multiple selection.

**Good to know:** When `multiple` is `true`, the `selectionBehavior` is automatically set to `clear`.
It is recommended to render the selected items in a separate container. |
| name | undefined | `string` | The `name` attribute of the combobox's input. Useful for form submission |
| navigate | undefined | `(details: NavigateDetails) => void` | Function to navigate to the selected item |
| onExitComplete | undefined | `VoidFunction` | Function called when the animation ends in the closed state |
| onFocusOutside | undefined | `(event: FocusOutsideEvent) => void` | Function called when the focus is moved outside the component |
| onHighlightChange | undefined | `(details: HighlightChangeDetails<T>) => void` | Function called when an item is highlighted using the pointer
or keyboard navigation. |
| onInputValueChange | undefined | `(details: InputValueChangeDetails) => void` | Function called when the input's value changes |
| onInteractOutside | undefined | `(event: InteractOutsideEvent) => void` | Function called when an interaction happens outside the component |
| onOpenChange | undefined | `(details: OpenChangeDetails) => void` | Function called when the popup is opened |
| onPointerDownOutside | undefined | `(event: PointerDownOutsideEvent) => void` | Function called when the pointer is pressed down outside the component |
| onSelect | undefined | `(details: SelectionDetails) => void` | Function called when an item is selected |
| onValueChange | undefined | `(details: ValueChangeDetails<T>) => void` | Function called when a new item is selected |
| open | undefined | `boolean` | The controlled open state of the combobox |
| placeholder | undefined | `string` | The placeholder text of the combobox's input |
| present | undefined | `boolean` | Whether the node is present (controlled by the user) |
| readOnly | undefined | `boolean` | Whether the combobox is readonly. This puts the combobox in a "non-editable" mode
but the user can still interact with it |
| required | undefined | `boolean` | Whether the combobox is required |
| scrollToIndexFn | undefined | `(details: ScrollToIndexDetails) => void` | Function to scroll to a specific index |
| translations | undefined | `IntlTranslations` | Specifies the localized strings that identifies the accessibility elements and their states |
| value | undefined | `string[]` | The controlled value of the combobox's selected items |


### Item

| Prop | Default | Type | Description |
| --- | --- | --- | --- |
| as | undefined | `React.ElementType` | The underlying element to render. |
| asChild | undefined | `boolean` | Use the provided child element as the default rendered element, combining their props and behavior. |
| item | undefined | `any` | The item to render |
| persistFocus | undefined | `boolean` | Whether hovering outside should clear the highlighted state |


Variants
Use the variant prop to change the variant of the tree view.

import { For, Stack, TreeView, createTreeCollection } from "@chakra-ui/react"
import { LuFile, LuFolder } from "react-icons/lu"

const Demo = () => {
  return (
    <Stack gap="8">
      <For each={["subtle", "solid"]}>
        {(variant) => (
          <TreeView.Root
            key={variant}
            collection={collection}
            maxW="sm"
            size="sm"
            variant={variant}
            colorPalette="teal"
            defaultSelectedValue={["node_modules"]}
          >
            <TreeView.Label>Tree (variant={variant})</TreeView.Label>
            <TreeView.Tree>
              <TreeView.Node
                render={({ node, nodeState }) =>
                  nodeState.isBranch ? (
                    <TreeView.BranchControl>
                      <LuFolder />
                      <TreeView.BranchText>{node.name}</TreeView.BranchText>
                    </TreeView.BranchControl>
                  ) : (
                    <TreeView.Item>
                      <LuFile />
                      <TreeView.ItemText>{node.name}</TreeView.ItemText>
                    </TreeView.Item>
                  )
                }
              />
            </TreeView.Tree>
          </TreeView.Root>
        )}
      </For>
    </Stack>
  )
}

interface Node {
  id: string
  name: string
  children?: Node[]
}

const collection = createTreeCollection<Node>({
  nodeToValue: (node) => node.id,
  nodeToString: (node) => node.name,
  rootNode: {
    id: "ROOT",
    name: "",
    children: [
      {
        id: "node_modules",
        name: "node_modules",
        children: [
          { id: "node_modules/zag-js", name: "zag-js" },
          { id: "node_modules/pandacss", name: "panda" },
          {
            id: "node_modules/@types",
            name: "@types",
            children: [
              { id: "node_modules/@types/react", name: "react" },
              { id: "node_modules/@types/react-dom", name: "react-dom" },
            ],
          },
        ],
      },
      {
        id: "src",
        name: "src",
        children: [
          { id: "src/app.tsx", name: "app.tsx" },
          { id: "src/index.ts", name: "index.ts" },
        ],
      },
      { id: "panda.config", name: "panda.config.ts" },
      { id: "package.json", name: "package.json" },
      { id: "renovate.json", name: "renovate.json" },
      { id: "readme.md", name: "README.md" },
    ],
  },
})


Colors
Use the colorPalette prop to change the color palette of the tree view.

"use client"

import { For, TreeView, Wrap, createTreeCollection } from "@chakra-ui/react"
import { colorPalettes } from "compositions/lib/color-palettes"
import { LuFile, LuFolder } from "react-icons/lu"

const Demo = () => {
  return (
    <Wrap gap="8">
      <For each={colorPalettes}>
        {(colorPalette) => (
          <TreeView.Root
            key={colorPalette}
            collection={collection}
            maxW="xs"
            size="sm"
            colorPalette={colorPalette}
            defaultSelectedValue={["node_modules"]}
          >
            <TreeView.Label>Tree (colorPalette={colorPalette})</TreeView.Label>
            <TreeView.Tree>
              <TreeView.Node
                render={({ node, nodeState }) =>
                  nodeState.isBranch ? (
                    <TreeView.BranchControl>
                      <LuFolder />
                      <TreeView.BranchText>{node.name}</TreeView.BranchText>
                    </TreeView.BranchControl>
                  ) : (
                    <TreeView.Item>
                      <LuFile />
                      <TreeView.ItemText>{node.name}</TreeView.ItemText>
                    </TreeView.Item>
                  )
                }
              />
            </TreeView.Tree>
          </TreeView.Root>
        )}
      </For>
    </Wrap>
  )
}

interface Node {
  id: string
  name: string
  children?: Node[]
}

const collection = createTreeCollection<Node>({
  nodeToValue: (node) => node.id,
  nodeToString: (node) => node.name,
  rootNode: {
    id: "ROOT",
    name: "",
    children: [
      {
        id: "node_modules",
        name: "node_modules",
        children: [
          { id: "node_modules/zag-js", name: "zag-js" },
          { id: "node_modules/pandacss", name: "panda" },
          {
            id: "node_modules/@types",
            name: "@types",
            children: [
              { id: "node_modules/@types/react", name: "react" },
              { id: "node_modules/@types/react-dom", name: "react-dom" },
            ],
          },
        ],
      },
      {
        id: "src",
        name: "src",
        children: [
          { id: "src/app.tsx", name: "app.tsx" },
          { id: "src/index.ts", name: "index.ts" },
        ],
      },
      { id: "panda.config", name: "panda.config.ts" },
      { id: "package.json", name: "package.json" },
      { id: "renovate.json", name: "renovate.json" },
      { id: "readme.md", name: "README.md" },
    ],
  },
})



# components > QR Code

  URL: docs/components/qr-code
  Source: https://raw.githubusercontent.com/chakra-ui/chakra-ui/refs/heads/main/apps/www/content/docs/components/qr-code.mdx

  A component that generates a QR code based on the provided data.

  ***

  title: QR Code
  description: A component that generates a QR code based on the provided data.
  links:
 - source: https://github.com/chakra-ui/chakra-ui/tree/main/packages/react/src/components/qr-code
 - storybook: https://storybook.chakra-ui.com/?path=/story/components-qr-code--basic
 - recipe: https://github.com/chakra-ui/chakra-ui/tree/main/packages/react/src/theme/recipes/qr-code.ts
 - ark: https://ark-ui.com/react/docs/components/qr-code
  ------------------------------------------------------------------------------------------------

  ```tsx
import { QrCode } from "@chakra-ui/react"

export const QrCodeBasic = () => {
  return (
    <QrCode.Root value="https://www.google.com">
      <QrCode.Frame>
        <QrCode.Pattern />
      </QrCode.Frame>
    </QrCode.Root>
  )
}

```

## Usage

```tsx
import { QrCode } from "@chakra-ui/react"
```

```tsx
<QrCode.Root value="...">
  <QrCode.Frame>
    <QrCode.Pattern />
  </QrCode.Frame>
</QrCode.Root>
```

:::info

If you prefer a closed component composition, check out the
[snippet below](#closed-component).

:::

## Examples

### Sizes

Use the `size` prop to set the size of the QR code.

```tsx
import { For, QrCode, Stack } from "@chakra-ui/react"

export const QrCodeWithSizes = () => {
  return (
    <Stack>
      <For each={["2xs", "xs", "sm", "md", "lg", "xl", "2xl"]}>
        {(size) => (
          <QrCode.Root size={size} value="https://www.google.com" key={size}>
            <QrCode.Frame>
              <QrCode.Pattern />
            </QrCode.Frame>
          </QrCode.Root>
        )}
      </For>
    </Stack>
  )
}

```

### Logo Overlay

Pass the children prop to the `QrCode.Overlay` component to add a logo or
overlay to the QR code.

```tsx
import { QrCode } from "@chakra-ui/react"

export const QrCodeWithOverlay = () => {
  return (
    <QrCode.Root value="https://www.google.com">
      <QrCode.Frame>
        <QrCode.Pattern />
      </QrCode.Frame>
      <QrCode.Overlay>
        <Logo />
      </QrCode.Overlay>
    </QrCode.Root>
  )
}

const Logo = () => {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10 0C15.5228 0 20 4.47715 20 10V0H30C35.5228 0 40 4.47715 40 10C40 15.5228 35.5228 20 30 20C35.5228 20 40 24.4772 40 30C40 32.7423 38.8961 35.2268 37.1085 37.0334L37.0711 37.0711L37.0379 37.1041C35.2309 38.8943 32.7446 40 30 40C27.2741 40 24.8029 38.9093 22.999 37.1405C22.9756 37.1175 22.9522 37.0943 22.9289 37.0711C22.907 37.0492 22.8852 37.0272 22.8635 37.0051C21.0924 35.2009 20 32.728 20 30C20 35.5228 15.5228 40 10 40C4.47715 40 0 35.5228 0 30V20H10C4.47715 20 0 15.5228 0 10C0 4.47715 4.47715 0 10 0ZM18 10C18 14.4183 14.4183 18 10 18V2C14.4183 2 18 5.58172 18 10ZM38 30C38 25.5817 34.4183 22 30 22C25.5817 22 22 25.5817 22 30H38ZM2 22V30C2 34.4183 5.58172 38 10 38C14.4183 38 18 34.4183 18 30V22H2ZM22 18V2L30 2C34.4183 2 38 5.58172 38 10C38 14.4183 34.4183 18 30 18H22Z"
        fill="#5417D7"
      ></path>
    </svg>
  )
}

```

### Fill

Use the `fill` prop to set the fill color of the QR code.

```tsx
import { Flex, For, QrCode } from "@chakra-ui/react"

export const QrCodeWithFill = () => {
  return (
    <Flex gap="4">
      <For each={["#5417D7", "#FF0000"]}>
        {(fill) => (
          <QrCode.Root key={fill} value="https://www.google.com">
            <QrCode.Frame style={{ fill }}>
              <QrCode.Pattern />
            </QrCode.Frame>
          </QrCode.Root>
        )}
      </For>
    </Flex>
  )
}

```

### Download

Use the `QrCode.DownloadTrigger` to download the QR code.

> The `fileName` and the `mimeType` props are required.

```tsx
import { Button, QrCode } from "@chakra-ui/react"

export const QrCodeWithExport = () => {
  return (
    <QrCode.Root value="https://www.google.com">
      <QrCode.Frame>
        <QrCode.Pattern />
      </QrCode.Frame>

      <QrCode.DownloadTrigger
        asChild
        fileName="qr-code.png"
        mimeType="image/png"
      >
        <Button variant="outline" size="xs" mt="3">
          Download
        </Button>
      </QrCode.DownloadTrigger>
    </QrCode.Root>
  )
}

```

### Error Correction

In cases where the link is too long or the logo overlay covers a significant
area, the error correction level can be increased.

Use the `encoding.ecc` or `encoding.boostEcc` property to set the error
correction level:

- `L`: Allows recovery of up to 7% data loss (default)
- `M`: Allows recovery of up to 15% data loss
- `Q`: Allows recovery of up to 25% data loss
- `H`: Allows recovery of up to 30% data loss

```tsx
"use client"

import { QrCode, SegmentGroup, Stack } from "@chakra-ui/react"
import { useState } from "react"

type ErrorLevel = "L" | "M" | "Q" | "H"

export const QrCodeWithErrorLevel = () => {
  const [errorLevel, setErrorLevel] = useState<ErrorLevel>("L")
  return (
    <Stack align="flex-start">
      <QrCode.Root
        value="https://www.google.com"
        size="xl"
        encoding={{ ecc: errorLevel }}
      >
        <QrCode.Frame />
      </QrCode.Root>
      <SegmentGroup.Root
        size="sm"
        defaultValue={"L"}
        onValueChange={(e) => setErrorLevel(e.value as ErrorLevel)}
      >
        <SegmentGroup.Indicator />
        <SegmentGroup.Items items={["L", "M", "Q", "H"]} />
      </SegmentGroup.Root>
    </Stack>
  )
}

```

### Store

The `RootProvider` component provides a context for the QR code.

It accepts the value of the `useQrCode` hook. You can leverage it to access the
component state and methods from outside the QR code.

```tsx
"use client"

import { Button, QrCode, Stack, useQrCode } from "@chakra-ui/react"

export const QrCodeWithStore = () => {
  const qrCode = useQrCode({ defaultValue: "https://www.google.com" })
  return (
    <Stack align="flex-start">
      <Button onClick={() => qrCode.setValue("https://www.x.com")}>
        Update to x.com
      </Button>
      <QrCode.RootProvider value={qrCode}>
        <QrCode.Frame>
          <QrCode.Pattern />
        </QrCode.Frame>
      </QrCode.RootProvider>
    </Stack>
  )
}

```

### Input

Here's an example of how to use the `QrCode` component with an `Input`
component.

```tsx
"use client"

import { Input, QrCode, Stack } from "@chakra-ui/react"
import { useState } from "react"

export const QrCodeWithInput = () => {
  const [value, setValue] = useState("https://www.google.com")
  return (
    <Stack maxW="240px" gap="4">
      <QrCode.Root value={value}>
        <QrCode.Frame>
          <QrCode.Pattern />
        </QrCode.Frame>
      </QrCode.Root>
      <Input value={value} onChange={(e) => setValue(e.target.value)} />
    </Stack>
  )
}

```

### Spinner

Here's an example of how to use the `QrCode` component with a `Spinner`
component.

```tsx
import { AbsoluteCenter, Box, QrCode, Spinner } from "@chakra-ui/react"

export const QrCodeWithSpinner = () => {
  return (
    <Box position="relative">
      <QrCode.Root value="https://www.google.com">
        <QrCode.Frame>
          <QrCode.Pattern />
        </QrCode.Frame>

        <AbsoluteCenter bg="bg/80" boxSize="100%">
          <Spinner color="red" />
        </AbsoluteCenter>
      </QrCode.Root>
    </Box>
  )
}

```

### Closed Component

Here's how to setup the QR code for a closed component composition.

<ExampleCode name="qr-code-closed-component" />

If you want to automatically add the closed component to your project, run the
command:

```bash
npx @chakra-ui/cli snippet add qr-code
```

## Props

### Root

| Prop | Default | Type | Description |
| --- | --- | --- | --- |
| colorPalette | gray | `'gray' \| 'red' \| 'orange' \| 'yellow' \| 'green' \| 'teal' \| 'blue' \| 'cyan' \| 'purple' \| 'pink'` | The color palette of the component |
| size | md | `'2xs' \| 'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| '2xl' \| 'full'` | The size of the component |
| as | undefined | `React.ElementType` | The underlying element to render. |
| asChild | undefined | `boolean` | Use the provided child element as the default rendered element, combining their props and behavior. |
| unstyled | undefined | `boolean` | Whether to remove the component's style. |
| defaultValue | undefined | `string` | The initial value to encode when rendered.
Use when you don't need to control the value of the qr code. |
| encoding | undefined | `QrCodeGenerateOptions` | The qr code encoding options. |
| id | undefined | `string` | The unique identifier of the machine. |
| ids | undefined | `Partial<{ root: string; frame: string }>` | The element ids. |
| onValueChange | undefined | `(details: ValueChangeDetails) => void` | Callback fired when the value changes. |
| pixelSize | undefined | `number` | The pixel size of the qr code. |
| value | undefined | `string` | The controlled value to encode. |


### DownloadTrigger

| Prop | Default | Type | Description |
| --- | --- | --- | --- |
| fileName | undefined | `string` | The name of the file. |
| mimeType | undefined | `DataUrlType` | The mime type of the image. |
| asChild | undefined | `boolean` | Use the provided child element as the default rendered element, combining their props and behavior. |
| quality | undefined | `number` | The quality of the image. |


# components > Input

  URL: docs/components/input
  Source: https://raw.githubusercontent.com/chakra-ui/chakra-ui/refs/heads/main/apps/www/content/docs/components/input.mdx

  Used to get user input in a text field.

  ***

  title: Input
  description: Used to get user input in a text field.
  links:
 - source: https://github.com/chakra-ui/chakra-ui/tree/main/packages/react/src/components/input
 - storybook: https://storybook.chakra-ui.com/?path=/story/components-input--basic
 - recipe: https://github.com/chakra-ui/chakra-ui/tree/main/packages/react/src/theme/recipes/input.ts
  ------------------------------------------------------------------------------------------------

  ```tsx
import { Input } from "@chakra-ui/react"

export const InputBasic = () => {
  return <Input placeholder="Enter your email" />
}

```

## Usage

```tsx
import { Input } from "@chakra-ui/react"
```

```tsx
<Input />
```

## Examples

### Variants

Use the `variant` prop to change the visual style of the input.

```tsx
import { Input, Stack } from "@chakra-ui/react"

export const InputWithVariants = () => {
  return (
    <Stack gap="4">
      <Input placeholder="Subtle" variant="subtle" />
      <Input placeholder="Outline" variant="outline" />
      <Input placeholder="Flushed" variant="flushed" />
    </Stack>
  )
}

```

### Sizes

Use the `size` prop to change the size of the input.

```tsx
import { Input, Stack } from "@chakra-ui/react"

export const InputWithSizes = () => {
  return (
    <Stack gap="4">
      <Input placeholder="size (xs)" size="xs" />
      <Input placeholder="size (sm)" size="sm" />
      <Input placeholder="size (md)" size="md" />
      <Input placeholder="size (lg)" size="lg" />
    </Stack>
  )
}

```

### Helper Text

Pair the input with the `Field` component to add helper text.

```tsx
import { Field, Input } from "@chakra-ui/react"

export const InputWithHelperText = () => {
  return (
    <Field.Root required>
      <Field.Label>
        Email <Field.RequiredIndicator />
      </Field.Label>
      <Input placeholder="Enter your email" />
      <Field.HelperText>We'll never share your email.</Field.HelperText>
    </Field.Root>
  )
}

```

### Error Text

Pair the input with the `Field` component to add error text.

```tsx
import { Field, Input } from "@chakra-ui/react"

export const InputWithErrorText = () => {
  return (
    <Field.Root invalid>
      <Field.Label>Email</Field.Label>
      <Input placeholder="Enter your email" />
      <Field.ErrorText>This field is required</Field.ErrorText>
    </Field.Root>
  )
}

```

### Field

Compose the input with the `Field` component to add a label, helper text, and
error text.

```tsx
import { Field, HStack, Input } from "@chakra-ui/react"

export const InputWithField = () => {
  return (
    <HStack gap="10" width="full">
      <Field.Root required>
        <Field.Label>
          Email <Field.RequiredIndicator />
        </Field.Label>
        <Input placeholder="me@example.com" variant="subtle" />
      </Field.Root>
      <Field.Root required>
        <Field.Label>
          Email <Field.RequiredIndicator />
        </Field.Label>
        <Input placeholder="me@example.com" variant="outline" />
      </Field.Root>
    </HStack>
  )
}

```

### Hook Form

Here's an example of how to integrate the input with `react-hook-form`.

```tsx
"use client"

import { Button, Field, Input, Stack } from "@chakra-ui/react"
import { useForm } from "react-hook-form"

interface FormValues {
  firstName: string
  lastName: string
}

export const InputWithHookForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>()

  const onSubmit = handleSubmit((data) => console.log(data))

  return (
    <form onSubmit={onSubmit}>
      <Stack gap="4" align="flex-start" maxW="sm">
        <Field.Root invalid={!!errors.firstName}>
          <Field.Label>First name</Field.Label>
          <Input {...register("firstName")} />
          <Field.ErrorText>{errors.firstName?.message}</Field.ErrorText>
        </Field.Root>

        <Field.Root invalid={!!errors.lastName}>
          <Field.Label>Last name</Field.Label>
          <Input {...register("lastName")} />
          <Field.ErrorText>{errors.lastName?.message}</Field.ErrorText>
        </Field.Root>

        <Button type="submit">Submit</Button>
      </Stack>
    </form>
  )
}

```

### Element

Use the `startElement` and `endElement` on the `InputGroup` component to add an
element to the start and end of the input.

#### Start Icon

```tsx
import { Input, InputGroup } from "@chakra-ui/react"
import { LuUser } from "react-icons/lu"

export const InputWithStartIcon = () => {
  return (
    <InputGroup startElement={<LuUser />}>
      <Input placeholder="Username" />
    </InputGroup>
  )
}

```

#### Start Text

```tsx
import { Input, InputGroup } from "@chakra-ui/react"

export const InputWithStartText = () => {
  return (
    <InputGroup
      startElement="https://"
      startElementProps={{ color: "fg.muted" }}
    >
      <Input ps="7ch" placeholder="yoursite.com" />
    </InputGroup>
  )
}

```

#### Start and End Text

```tsx
import { Input, InputGroup } from "@chakra-ui/react"

export const InputWithStartAndEndText = () => {
  return (
    <InputGroup startElement="$" endElement="USD">
      <Input placeholder="0.00" />
    </InputGroup>
  )
}

```

#### Kbd

```tsx
import { Input, InputGroup, Kbd } from "@chakra-ui/react"
import { LuSearch } from "react-icons/lu"

export const InputWithKbd = () => (
  <InputGroup flex="1" startElement={<LuSearch />} endElement={<Kbd>⌘K</Kbd>}>
    <Input placeholder="Search contacts" />
  </InputGroup>
)

```

#### Select

```tsx
import { Input, InputGroup, NativeSelect } from "@chakra-ui/react"

const DomainSelect = () => (
  <NativeSelect.Root size="xs" variant="plain" width="auto" me="-1">
    <NativeSelect.Field defaultValue=".com" fontSize="sm">
      <option value=".com">.com</option>
      <option value=".org">.org</option>
      <option value=".net">.net</option>
    </NativeSelect.Field>
    <NativeSelect.Indicator />
  </NativeSelect.Root>
)

export const InputWithSelect = () => {
  return (
    <InputGroup flex="1" startElement="https://" endElement={<DomainSelect />}>
      <Input ps="4.75em" pe="0" placeholder="yoursite.com" />
    </InputGroup>
  )
}

```

### Addon

Use the `InputAddon` and `Group` components to add an addon to the input.

#### Start Addon

```tsx
import { Input, InputGroup } from "@chakra-ui/react"

export const InputWithStartAddon = () => {
  return (
    <InputGroup startAddon="https://">
      <Input placeholder="yoursite.com" />
    </InputGroup>
  )
}

```

#### End Addon

```tsx
import { Input, InputGroup } from "@chakra-ui/react"

export const InputWithEndAddon = () => {
  return (
    <InputGroup endAddon=".com">
      <Input placeholder="yoursite" />
    </InputGroup>
  )
}

```

#### Start and End Addon

```tsx
import { Input, InputGroup } from "@chakra-ui/react"

export const InputWithStartAndEndAddon = () => {
  return (
    <InputGroup startAddon="$" endAddon="USD">
      <Input placeholder="0.00" />
    </InputGroup>
  )
}

```

### Disabled

Use the `disabled` prop to disable the input.

```tsx
import { Input } from "@chakra-ui/react"

export const InputWithDisabled = () => {
  return <Input disabled placeholder="disabled" />
}

```

### Button

Use the `Group` component to attach a button to the input.

```tsx
import { Button, Group, Input } from "@chakra-ui/react"

export const InputWithEndButton = () => {
  return (
    <Group attached w="full" maxW="sm">
      <Input flex="1" placeholder="Enter your email" />
      <Button bg="bg.subtle" variant="outline">
        Submit
      </Button>
    </Group>
  )
}

```

### Focus and Error Color

Use the `--focus-color` and `--error-color` CSS custom properties to change the
color of the input when it is focused or in an error state.

```tsx
import { Field, Input, Stack } from "@chakra-ui/react"

export const InputWithFocusErrorColor = () => {
  return (
    <Stack gap="4">
      <Field.Root>
        <Field.Label>focusColor=lime</Field.Label>
        <Input placeholder="Focus me" css={{ "--focus-color": "lime" }} />
      </Field.Root>
      <Field.Root invalid>
        <Field.Label>errorColor=green</Field.Label>
        <Input placeholder="Email" css={{ "--error-color": "green" }} />
      </Field.Root>
      <Field.Root invalid>
        <Field.Label>errorColor=blue</Field.Label>
        <Input placeholder="Password" css={{ "--error-color": "blue" }} />
      </Field.Root>

      <Field.Root invalid>
        <Field.Label>variant=outline,focusColor=error</Field.Label>
        <Input placeholder="Focus me" variant="outline" />
      </Field.Root>
      <Field.Root invalid>
        <Field.Label>variant=subtle,focusColor=error</Field.Label>
        <Input placeholder="Focus me" variant="subtle" />
      </Field.Root>
      <Field.Root invalid>
        <Field.Label>variant=flushed,focusColor=error</Field.Label>
        <Input placeholder="Focus me" variant="flushed" />
      </Field.Root>
    </Stack>
  )
}

```

### Placeholder Style

Use the `_placeholder` prop to style the placeholder text.

```tsx
import { Input } from "@chakra-ui/react"

export const InputWithPlaceholderStyle = () => {
  return (
    <Input
      color="teal"
      placeholder="custom placeholder"
      _placeholder={{ color: "inherit" }}
    />
  )
}

```

### Floating Label

Here's an example of how to build a floating label to the input.

```tsx
import { Box, Field, Input, defineStyle } from "@chakra-ui/react"

export const InputWithFloatingLabel = () => {
  return (
    <Field.Root>
      <Box pos="relative" w="full">
        <Input className="peer" placeholder="" />
        <Field.Label css={floatingStyles}>Email</Field.Label>
      </Box>
    </Field.Root>
  )
}

const floatingStyles = defineStyle({
  pos: "absolute",
  bg: "bg",
  px: "0.5",
  top: "-3",
  insetStart: "2",
  fontWeight: "normal",
  pointerEvents: "none",
  transition: "position",
  _peerPlaceholderShown: {
    color: "fg.muted",
    top: "2.5",
    insetStart: "3",
  },
  _peerFocusVisible: {
    color: "fg",
    top: "-3",
    insetStart: "2",
  },
})

```

### Mask

Here's an example of using the `use-mask-input` library to mask the input shape.

```tsx
"use client"

import { Input } from "@chakra-ui/react"
import { withMask } from "use-mask-input"

export const InputWithMask = () => {
  return (
    <Input placeholder="(99) 99999-9999" ref={withMask("(99) 99999-9999")} />
  )
}

```

### Character Counter

Here's an example of how to add a character counter to the input.

```tsx
"use client"

import { Input, InputGroup, Span } from "@chakra-ui/react"
import { useState } from "react"

const MAX_CHARACTERS = 20

export const InputWithCharacterCounter = () => {
  const [value, setValue] = useState("")
  return (
    <InputGroup
      endElement={
        <Span color="fg.muted" textStyle="xs">
          {value.length} / {MAX_CHARACTERS}
        </Span>
      }
    >
      <Input
        placeholder="Enter your message"
        value={value}
        maxLength={MAX_CHARACTERS}
        onChange={(e) => {
          setValue(e.currentTarget.value.slice(0, MAX_CHARACTERS))
        }}
      />
    </InputGroup>
  )
}

```

### Card Number

Here's an example of using `react-payment-inputs` to create a card number input.

```tsx
"use client"

import { Input, InputGroup } from "@chakra-ui/react"
import { LuCreditCard } from "react-icons/lu"
import { usePaymentInputs } from "react-payment-inputs"

export const InputWithCardNumber = () => {
  const { wrapperProps, getCardNumberProps } = usePaymentInputs()
  return (
    <InputGroup {...wrapperProps} endElement={<LuCreditCard />}>
      <Input {...getCardNumberProps()} />
    </InputGroup>
  )
}

```

You can create a full card inputs for a card number, expiry date, and CVC.

```tsx
"use client"

import { Box, Group, Input, InputGroup, Show } from "@chakra-ui/react"
import { LuCreditCard } from "react-icons/lu"
import { usePaymentInputs } from "react-payment-inputs"
import cardImages, { type CardImages } from "react-payment-inputs/images"

const images = cardImages as unknown as CardImages

const CardImage = (props: ReturnType<typeof usePaymentInputs>) => {
  const { meta, getCardImageProps } = props
  return (
    <Show
      when={meta.cardType}
      fallback={<LuCreditCard size={16} aria-hidden="true" />}
    >
      <svg {...getCardImageProps({ images })} />
    </Show>
  )
}

export const InputWithCardDetails = () => {
  const payment = usePaymentInputs()
  return (
    <Box spaceY="-1px">
      <InputGroup
        zIndex={{ _focusWithin: "1" }}
        endElement={<CardImage {...payment} />}
      >
        <Input roundedBottom="0" {...payment.getCardNumberProps()} />
      </InputGroup>
      <Group w="full" attached>
        <Input roundedTopLeft="0" {...payment.getExpiryDateProps()} />
        <Input roundedTopRight="0" {...payment.getCVCProps()} />
      </Group>
    </Box>
  )
}

```

### Clear Button

Combine the `Input` and `CloseButton` components to create a clear button. This
is useful for building search inputs.

```tsx
"use client"

import { CloseButton, Input, InputGroup } from "@chakra-ui/react"
import { useRef, useState } from "react"

export const InputWithClearButton = () => {
  const [value, setValue] = useState("Initial value")
  const inputRef = useRef<HTMLInputElement | null>(null)

  const endElement = value ? (
    <CloseButton
      size="xs"
      onClick={() => {
        setValue("")
        inputRef.current?.focus()
      }}
      me="-2"
    />
  ) : undefined

  return (
    <InputGroup endElement={endElement}>
      <Input
        ref={inputRef}
        placeholder="Email"
        value={value}
        onChange={(e) => {
          setValue(e.currentTarget.value)
        }}
      />
    </InputGroup>
  )
}

```

## Props

| Prop | Default | Type | Description |
| --- | --- | --- | --- |
| colorPalette | gray | `'gray' \| 'red' \| 'orange' \| 'yellow' \| 'green' \| 'teal' \| 'blue' \| 'cyan' \| 'purple' \| 'pink'` | The color palette of the component |
| size | md | `'2xs' \| 'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| '2xl'` | The size of the component |
| variant | outline | `'outline' \| 'subtle' \| 'flushed'` | The variant of the component |
| as | undefined | `React.ElementType` | The underlying element to render. |
| asChild | undefined | `boolean` | Use the provided child element as the default rendered element, combining their props and behavior. |



# components > File Upload

  URL: docs/components/file-upload
  Source: https://raw.githubusercontent.com/chakra-ui/chakra-ui/refs/heads/main/apps/www/content/docs/components/file-upload.mdx

  Used to select and upload files from their device.

  ***

  title: File Upload
  description: Used to select and upload files from their device.
  links:
 - source: https://github.com/chakra-ui/chakra-ui/tree/main/packages/react/src/components/file-upload
 - storybook: https://storybook.chakra-ui.com/?path=/story/components-file-upload--basic
 - recipe: https://github.com/chakra-ui/chakra-ui/tree/main/packages/react/src/theme/recipes/file-upload.ts
 - ark: https://ark-ui.com/react/docs/components/file-upload
  ------------------------------------------------------------------------------------------------

  ```tsx
import { Button, FileUpload } from "@chakra-ui/react"
import { HiUpload } from "react-icons/hi"

export const FileUploadBasic = () => {
  return (
    <FileUpload.Root>
      <FileUpload.HiddenInput />
      <FileUpload.Trigger asChild>
        <Button variant="outline" size="sm">
          <HiUpload /> Upload file
        </Button>
      </FileUpload.Trigger>
      <FileUpload.List />
    </FileUpload.Root>
  )
}

```

## Usage

```jsx
import { FileUpload } from "@chakra-ui/react"
```

```jsx
<FileUpload.Root>
  <FileUpload.HiddenInput />
  <FileUpload.Label />
  <FileUpload.Dropzone>
    <FileUpload.DropzoneContent />
  </FileUpload.Dropzone>
  <FileUpload.Trigger />
  <FileUpload.ItemGroup>
    <FileUpload.Item>
      <FileUpload.ItemPreview />
      <FileUpload.ItemFileName />
      <FileUpload.ItemSizeText />
      <FileUpload.ItemDeleteTrigger />
    </FileUpload.Item>
  </FileUpload.ItemGroup>
</FileUpload.Root>
```

## Shortcuts

The `FileUpload` component also provides a set of shortcuts for common use
cases.

### FileUploadItems

By default, the `FileUploadItems` shortcut renders the list of uploaded files.

This works:

```tsx
<FileUpload.ItemGroup>
  <FileUpload.Context>
    {({ acceptedFiles }) =>
      acceptedFiles.map((file) => (
        <FileUpload.Item key={file.name} file={file}>
          <FileUpload.ItemPreview />
          <FileUpload.ItemName />
          <FileUpload.ItemSizeText />
          <FileUpload.ItemDeleteTrigger />
        </FileUpload.Item>
      ))
    }
  </FileUpload.Context>
</FileUpload.ItemGroup>
```

This might be more concise, if you don't need to customize the file upload
items:

```tsx
<FileUpload.ItemGroup>
  <FileUpload.Items />
</FileUpload.ItemGroup>
```

### FileUploadList

The `FileUploadList` shortcut renders the list of uploaded files. It composes
the `FileUpload.ItemGroup` and `FileUpload.Items` components.

```tsx
<FileUpload.List />
```

is the same as:

```tsx
<FileUpload.ItemGroup>
  <FileUpload.Items />
</FileUpload.ItemGroup>
```

## Examples

### Accepted Files

Define the accepted files for upload using the `accept` prop.

```tsx
import { Button, FileUpload } from "@chakra-ui/react"
import { HiUpload } from "react-icons/hi"

export const FileUploadAcceptedFiles = () => {
  return (
    <FileUpload.Root accept={["image/png"]}>
      <FileUpload.HiddenInput />
      <FileUpload.Trigger asChild>
        <Button variant="outline" size="sm">
          <HiUpload /> Upload file
        </Button>
      </FileUpload.Trigger>
      <FileUpload.List />
    </FileUpload.Root>
  )
}

```

### Multiple Files

Upload multiple files at once by using the `maxFiles` prop.

```tsx
import { Button, FileUpload } from "@chakra-ui/react"
import { HiUpload } from "react-icons/hi"

export const FileUploadMultiple = () => {
  return (
    <FileUpload.Root maxFiles={5}>
      <FileUpload.HiddenInput />
      <FileUpload.Trigger asChild>
        <Button variant="outline" size="sm">
          <HiUpload /> Upload file
        </Button>
      </FileUpload.Trigger>
      <FileUpload.List showSize clearable />
    </FileUpload.Root>
  )
}

```

### Custom Preview

Here's an example of how to show a custom image preview for files.

```tsx
"use client"

import {
  Button,
  FileUpload,
  Float,
  useFileUploadContext,
} from "@chakra-ui/react"
import { LuFileImage, LuX } from "react-icons/lu"

const FileUploadList = () => {
  const fileUpload = useFileUploadContext()
  const files = fileUpload.acceptedFiles
  if (files.length === 0) return null
  return (
    <FileUpload.ItemGroup>
      {files.map((file) => (
        <FileUpload.Item
          w="auto"
          boxSize="20"
          p="2"
          file={file}
          key={file.name}
        >
          <FileUpload.ItemPreviewImage />
          <Float placement="top-end">
            <FileUpload.ItemDeleteTrigger boxSize="4" layerStyle="fill.solid">
              <LuX />
            </FileUpload.ItemDeleteTrigger>
          </Float>
        </FileUpload.Item>
      ))}
    </FileUpload.ItemGroup>
  )
}

export const FileUploadCustomPreview = () => {
  return (
    <FileUpload.Root accept="image/*">
      <FileUpload.HiddenInput />
      <FileUpload.Trigger asChild>
        <Button variant="outline" size="sm">
          <LuFileImage /> Upload Images
        </Button>
      </FileUpload.Trigger>
      <FileUploadList />
    </FileUpload.Root>
  )
}

```

### Directory

Use the `directory` prop to allow selecting a directory instead of a file.

```tsx
import { Button, FileUpload } from "@chakra-ui/react"
import { HiUpload } from "react-icons/hi"

export const FileUploadDirectory = () => {
  return (
    <FileUpload.Root directory>
      <FileUpload.HiddenInput />
      <FileUpload.Trigger asChild>
        <Button variant="outline" size="sm">
          <HiUpload /> Upload file
        </Button>
      </FileUpload.Trigger>
      <FileUpload.List />
    </FileUpload.Root>
  )
}

```

### Media Capture

Use the `capture` prop to select and upload files from different environments
and media types.

> **Note:** This is
> [not fully supported](https://caniuse.com/mdn-api_htmlinputelement_capture) in
> all browsers.

```tsx
import { Button, FileUpload } from "@chakra-ui/react"
import { HiCamera } from "react-icons/hi"

export const FileUploadMediaCapture = () => {
  return (
    <FileUpload.Root capture="environment">
      <FileUpload.HiddenInput />
      <FileUpload.Trigger asChild>
        <Button variant="outline" size="sm">
          <HiCamera /> Open Camera
        </Button>
      </FileUpload.Trigger>
      <FileUpload.List />
    </FileUpload.Root>
  )
}

```

### Dropzone

Drop multiple files inside the dropzone and use the `maxFiles` prop to set the
number of files that can be uploaded at once.

```tsx
import { Box, FileUpload, Icon } from "@chakra-ui/react"
import { LuUpload } from "react-icons/lu"

export const FileUploadWithDropzone = () => {
  return (
    <FileUpload.Root maxW="xl" alignItems="stretch" maxFiles={10}>
      <FileUpload.HiddenInput />
      <FileUpload.Dropzone>
        <Icon size="md" color="fg.muted">
          <LuUpload />
        </Icon>
        <FileUpload.DropzoneContent>
          <Box>Drag and drop files here</Box>
          <Box color="fg.muted">.png, .jpg up to 5MB</Box>
        </FileUpload.DropzoneContent>
      </FileUpload.Dropzone>
      <FileUpload.List />
    </FileUpload.Root>
  )
}

```

### Input

Use the `FileInput` component to create a trigger that looks like a text input.

```tsx
import { FileUpload, Input } from "@chakra-ui/react"

export const FileUploadWithInput = () => {
  return (
    <FileUpload.Root gap="1" maxWidth="300px">
      <FileUpload.HiddenInput />
      <FileUpload.Label>Upload file</FileUpload.Label>
      <Input asChild>
        <FileUpload.Trigger>
          <FileUpload.FileText />
        </FileUpload.Trigger>
      </Input>
    </FileUpload.Root>
  )
}

```

### Clearable

Here's an example of a clearable file upload input.

```tsx
import { CloseButton, FileUpload, Input, InputGroup } from "@chakra-ui/react"
import { LuFileUp } from "react-icons/lu"

export const FileUploadWithInputClear = () => {
  return (
    <FileUpload.Root gap="1" maxWidth="300px">
      <FileUpload.HiddenInput />
      <FileUpload.Label>Upload file</FileUpload.Label>
      <InputGroup
        startElement={<LuFileUp />}
        endElement={
          <FileUpload.ClearTrigger asChild>
            <CloseButton
              me="-1"
              size="xs"
              variant="plain"
              focusVisibleRing="inside"
              focusRingWidth="2px"
              pointerEvents="auto"
            />
          </FileUpload.ClearTrigger>
        }
      >
        <Input asChild>
          <FileUpload.Trigger>
            <FileUpload.FileText lineClamp={1} />
          </FileUpload.Trigger>
        </Input>
      </InputGroup>
    </FileUpload.Root>
  )
}

```

### Pasting Files

Here's an example of handling files pasted from the clipboard.

```tsx
"use client"

import {
  FileUpload,
  Float,
  HStack,
  Input,
  type InputProps,
  useFileUploadContext,
} from "@chakra-ui/react"
import { HiX } from "react-icons/hi"

const FilePasteInput = (props: InputProps) => {
  const fileUpload = useFileUploadContext()
  return (
    <Input
      {...props}
      onPaste={(e) => {
        fileUpload.setClipboardFiles(e.clipboardData)
      }}
    />
  )
}

const FileImageList = () => {
  const fileUpload = useFileUploadContext()
  return (
    <HStack wrap="wrap" gap="3">
      {fileUpload.acceptedFiles.map((file) => (
        <FileUpload.Item
          p="2"
          width="auto"
          key={file.name}
          file={file}
          pos="relative"
        >
          <Float placement="top-start">
            <FileUpload.ItemDeleteTrigger
              p="0.5"
              rounded="l1"
              bg="bg"
              borderWidth="1px"
            >
              <HiX />
            </FileUpload.ItemDeleteTrigger>
          </Float>
          <FileUpload.ItemPreviewImage
            boxSize="12"
            rounded="l1"
            objectFit="cover"
          />
        </FileUpload.Item>
      ))}
    </HStack>
  )
}

export const FileUploadWithPasteEvent = () => {
  return (
    <FileUpload.Root maxFiles={3} accept="image/*">
      <FileUpload.HiddenInput />
      <FileImageList />
      <FilePasteInput placeholder="Paste image here..." />
    </FileUpload.Root>
  )
}

```

### Store

An alternative way to control the file upload is to use the `RootProvider`
component and the `useFileUpload` store hook.

This way you can access the file upload state and methods from outside the file
upload.

```tsx
"use client"

import {
  Button,
  Code,
  FileUpload,
  Stack,
  useFileUpload,
} from "@chakra-ui/react"
import { HiUpload } from "react-icons/hi"

export const FileUploadWithStore = () => {
  const fileUpload = useFileUpload({
    maxFiles: 1,
    maxFileSize: 3000,
  })

  const accepted = fileUpload.acceptedFiles.map((file) => file.name)
  const rejected = fileUpload.rejectedFiles.map((e) => e.file.name)

  return (
    <Stack align="flex-start">
      <Code colorPalette="green">accepted: {accepted.join(", ")}</Code>
      <Code colorPalette="red">rejected: {rejected.join(", ")}</Code>
      <FileUpload.RootProvider value={fileUpload}>
        <FileUpload.HiddenInput />
        <FileUpload.Trigger asChild>
          <Button variant="outline" size="sm">
            <HiUpload /> Upload file
          </Button>
        </FileUpload.Trigger>
        <FileUpload.List />
      </FileUpload.RootProvider>
    </Stack>
  )
}

```

## Props

### Root

| Prop | Default | Type | Description |
| --- | --- | --- | --- |
| allowDrop | true | `boolean` | Whether to allow drag and drop in the dropzone element |
| locale | "en-US" | `string` | The current locale. Based on the BCP 47 definition. |
| maxFiles | 1 | `number` | The maximum number of files |
| maxFileSize | Infinity | `number` | The maximum file size in bytes |
| minFileSize | 0 | `number` | The minimum file size in bytes |
| preventDocumentDrop | true | `boolean` | Whether to prevent the drop event on the document |
| as | undefined | `React.ElementType` | The underlying element to render. |
| asChild | undefined | `boolean` | Use the provided child element as the default rendered element, combining their props and behavior. |
| unstyled | undefined | `boolean` | Whether to remove the component's style. |
| accept | undefined | `Record<string, string[]> \| FileMimeType \| FileMimeType[]` | The accept file types |
| acceptedFiles | undefined | `File[]` | The controlled accepted files |
| capture | undefined | `'user' \| 'environment'` | The default camera to use when capturing media |
| defaultAcceptedFiles | undefined | `File[]` | The default accepted files when rendered.
Use when you don't need to control the accepted files of the input. |
| directory | undefined | `boolean` | Whether to accept directories, only works in webkit browsers |
| disabled | undefined | `boolean` | Whether the file input is disabled |
| ids | undefined | `Partial<{\n  root: string\n  dropzone: string\n  hiddenInput: string\n  trigger: string\n  label: string\n  item: (id: string) => string\n  itemName: (id: string) => string\n  itemSizeText: (id: string) => string\n  itemPreview: (id: string) => string\n}>` | The ids of the elements. Useful for composition. |
| invalid | undefined | `boolean` | Whether the file input is invalid |
| name | undefined | `string` | The name of the underlying file input |
| onFileAccept | undefined | `(details: FileAcceptDetails) => void` | Function called when the file is accepted |
| onFileChange | undefined | `(details: FileChangeDetails) => void` | Function called when the value changes, whether accepted or rejected |
| onFileReject | undefined | `(details: FileRejectDetails) => void` | Function called when the file is rejected |
| required | undefined | `boolean` | Whether the file input is required |
| transformFiles | undefined | `(files: File[]) => Promise<File[]>` | Function to transform the accepted files to apply transformations |
| translations | undefined | `IntlTranslations` | The localized messages to use. |
| validate | undefined | `(file: File, details: FileValidateDetails) => FileError[] \| null` | Function to validate a file |



# theming > Overview

  URL: docs/theming/overview
  Source: https://raw.githubusercontent.com/chakra-ui/chakra-ui/refs/heads/main/apps/www/content/docs/theming/overview.mdx

  A guide for configuring the Chakra UI theming system.

  ***

  title: Overview
  description: A guide for configuring the Chakra UI theming system.
  links:

  ------------------------------------------------------------------------------------------------

  ## Architecture

The Chakra UI theming system is built around the API of
[Panda CSS](https://panda-css.com/).

Here's a quick overview of how the system is structured to provide a performant
and extensible styling system:

- Define the styling system configuration using the `defineConfig` function
- Create the styling engine using the `createSystem` function
- Pass the styling engine to the `ChakraProvider` component

```tsx
import {
  ChakraProvider,
  createSystem,
  defaultConfig,
  defineConfig,
} from "@chakra-ui/react"

const config = defineConfig({
  theme: {
    tokens: {
      colors: {},
    },
  },
})

const system = createSystem(defaultConfig, config)

export default function App() {
  return (
    <ChakraProvider value={system}>
      <Box>Hello World</Box>
    </ChakraProvider>
  )
}
```

## Config

The Chakra UI system is configured using the `defineConfig` function. This
function accepts a configuration object that allows you to customize the styling
system's behavior.

After a config is defined, it is passed to the `createSystem` function to create
the styling engine.

### cssVarsRoot

`cssVarsRoot` is the root element where the token CSS variables will be applied.

```tsx title="theme.ts"
const config = defineConfig({
  cssVarsRoot: ":where(:root, :host)",
})

export default createSystem(defaultConfig, config)
```

### cssVarsPrefix

`cssVarsPrefix` is the prefix used for the token CSS variables.

```tsx title="theme.ts"
const config = defineConfig({
  cssVarsPrefix: "ck",
})

export default createSystem(defaultConfig, config)
```

### globalCss

`globalCss` is used to apply global styles to the system.

```tsx title="theme.ts"
const config = defineConfig({
  globalCss: {
    "html, body": {
      margin: 0,
      padding: 0,
    },
  },
})

export default createSystem(defaultConfig, config)
```

### preflight

`preflight` is used to apply css reset styles to the system.

```tsx title="theme.ts"
const config = defineConfig({
  preflight: false,
})

export default createSystem(defaultConfig, config)
```

Alternatively, you can use the `preflight` config property to apply css reset
styles to the system. This is useful if you want to apply css reset styles to a
specific element.

```tsx title="theme.ts"
const config = defineConfig({
  preflight: {
    scope: ".chakra-reset",
  },
})

export default createSystem(defaultConfig, config)
```

### theme

Use the `theme` config property to define the system theme. This property
accepts the following properties:

- `breakpoints`: for defining breakpoints
- `keyframes`: for defining css keyframes animations
- `tokens`: for defining tokens
- `semanticTokens`: for defining semantic tokens
- `textStyles`: for defining typography styles
- `layerStyles`: for defining layer styles
- `animationStyles`: for defining animation styles
- `recipes`: for defining component recipes
- `slotRecipes`: for defining component slot recipes

```tsx title="theme.ts"
const config = defineConfig({
  theme: {
    breakpoints: {
      sm: "320px",
      md: "768px",
      lg: "960px",
      xl: "1200px",
    },
    tokens: {
      colors: {
        red: "#EE0F0F",
      },
    },
    semanticTokens: {
      colors: {
        danger: { value: "{colors.red}" },
      },
    },
    keyframes: {
      spin: {
        from: { transform: "rotate(0deg)" },
        to: { transform: "rotate(360deg)" },
      },
    },
  },
})

export default createSystem(defaultConfig, config)
```

### conditions

Use the `conditions` config property to define custom selectors and media query
conditions for use in the system.

```tsx title="theme.ts"
const config = defineConfig({
  conditions: {
    cqSm: "@container(min-width: 320px)",
    child: "& > *",
  },
})

export default createSystem(defaultConfig, config)
```

Sample usage:

```tsx
<Box mt="40px" _cqSm={{ mt: "0px" }}>
  <Text>Hello World</Text>
</Box>
```

### strictTokens

Use the `strictTokens` config property to enforce the usage of only design
tokens. This will throw a TS error if you try to use a token that is not defined
in the theme.

```tsx title="theme.ts"
const config = defineConfig({
  strictTokens: true,
})

export default createSystem(defaultConfig, config)
```

```tsx
// ❌ This will throw a TS error
<Box color="#4f343e">Hello World</Box>

// ✅ This will work
<Box color="red.400">Hello World</Box>
```

## TypeScript

When you configure the system properties (like `colors`, `space`, `fonts`,
etc.), the CLI can be used to generate type definitions for them.

```bash
npx @chakra-ui/cli typegen ./theme.ts
```

This will update the internal types in the `@chakra-ui/react` package, and make
sure they are in sync with the theme. Providing a type-safe API and delightful
experience for developers.

## System

After a config is defined, it is passed to the `createSystem` function to create
the styling engine. The returned `system` is framework-agnostic JavaScript
styling engine that can be used to style components.

```tsx
const system = createSystem(defaultConfig, config)
```

The system includes the following properties:

### token

The token function is used to get a raw token value, or css variable.

```tsx
const system = createSystem(defaultConfig, config)

// raw token
system.token("colors.red.200")
// => "#EE0F0F"

// token with fallback
system.token("colors.pink.240", "#000")
// => "#000"
```

Use the `token.var` function to get the css variable:

```tsx
// css variable
system.token.var("colors.red.200")
// => "var(--chakra-colors-red-200)"

// token with fallback
system.token.var("colors.pink.240", "colors.red.200")
// => "var(--chakra-colors-red-200)"
```

It's important to note that `semanticTokens` always return a css variable,
regardless of whether you use `token` or `token.var`. This is because semantic
tokens change based on the theme.

```tsx
// semantic token
system.token("colors.danger")
// => "var(--chakra-colors-danger)"

system.token.var("colors.danger")
// => "var(--chakra-colors-danger)"
```

### tokens

```tsx
const system = createSystem(defaultConfig, config)

system.tokens.getVar("colors.red.200")
// => "var(--chakra-colors-red-200)"

system.tokens.expandReferenceInValue("3px solid {colors.red.200}")
// => "3px solid var(--chakra-colors-red-200)"

system.tokens.cssVarMap
// => Map { "colors": Map { "red.200": "var(--chakra-colors-red-200)" } }

system.tokens.flatMap
// => Map { "colors.red.200": "var(--chakra-colors-red-200)" }
```

### css

The `css` function is used to convert chakra style objects to CSS style object
that can be passed to `emotion` or `styled-components` or any other styling
library.

```tsx
const system = createSystem(defaultConfig, config)

system.css({
  color: "red.200",
  bg: "blue.200",
})

// => { color: "var(--chakra-colors-red-200)", background: "var(--chakra-colors-blue-200)" }
```

### cva

The `cva` function is used to create component recipes. It returns a function
that, when called with a set of props, returns a style object.

```tsx
const system = createSystem(defaultConfig, config)

const button = system.cva({
  base: {
    color: "white",
    bg: "blue.500",
  },
  variants: {
    outline: {
      color: "blue.500",
      bg: "transparent",
      border: "1px solid",
    },
  },
})

button({ variant: "outline" })
// => { color: "blue.500", bg: "transparent", border: "1px solid" }
```

### sva

The `sva` function is used to create component slot recipes. It returns a
function that, when called with a set of props, returns a style object for each
slot.

```tsx
const system = createSystem(defaultConfig, config)

const alert = system.sva({
  slots: ["title", "description", "icon"],
  base: {
    title: { color: "white" },
    description: { color: "white" },
    icon: { color: "white" },
  },
  variants: {
    status: {
      info: {
        title: { color: "blue.500" },
        description: { color: "blue.500" },
        icon: { color: "blue.500" },
      },
    },
  },
})

alert({ status: "info" })
// => { title: { color: "blue.500" }, description: { color: "blue.500" }, icon: { color: "blue.500" } }
```

### isValidProperty

The `isValidProperty` function is used to check if a property is valid.

```tsx
const system = createSystem(defaultConfig, config)

system.isValidProperty("color")
// => true

system.isValidProperty("background")
// => true

system.isValidProperty("invalid")
// => false
```

### splitCssProps

The `splitCssProps` function is used to split the props into css props and
non-css props.

```tsx
const system = createSystem(defaultConfig, config)

system.splitCssProps({
  color: "red.200",
  bg: "blue.200",
  "aria-label": "Hello World",
})
// => [{ color: "red.200", bg: "blue.200" }, { "aria-label": "Hello World" }]
```

### breakpoints

The `breakpoints` property is used to query breakpoints.

```tsx
const system = createSystem(defaultConfig, config)

system.breakpoints.up("sm")
// => "@media (min-width: 320px)"

system.breakpoints.down("sm")
// => "@media (max-width: 319px)"

system.breakpoints.only("md")
// => "@media (min-width: 320px) and (max-width: 768px)"

system.breakpoints.keys()
// => ["sm", "md", "lg", "xl"]
```

## Tokens

To learn more about tokens, please refer to the [tokens](/docs/theming/tokens)
section.

## Recipes

To learn more about recipes, please refer to the
[recipes](/docs/theming/recipes) section.


# theming > Layer Styles

  URL: docs/theming/layer-styles
  Source: https://raw.githubusercontent.com/chakra-ui/chakra-ui/refs/heads/main/apps/www/content/docs/theming/layer-styles.mdx

  The built-in layer styles in Chakra UI

  ***

  title: Layer Styles
  description: The built-in layer styles in Chakra UI
  links:

  ------------------------------------------------------------------------------------------------

  Chakra UI provides these text styles out of the box.

<br />

<ExamplePreview name="tokens/layer-style" />



# components > Alert

  URL: docs/components/alert
  Source: https://raw.githubusercontent.com/chakra-ui/chakra-ui/refs/heads/main/apps/www/content/docs/components/alert.mdx

  Used to communicate a state that affects a system, feature or page.

  ***

  title: Alert
  description: Used to communicate a state that affects a system, feature or page.
  links:
 - source: https://github.com/chakra-ui/chakra-ui/tree/main/packages/react/src/components/alert
 - storybook: https://storybook.chakra-ui.com/?path=/story/components-alert--basic
 - recipe: https://github.com/chakra-ui/chakra-ui/tree/main/packages/react/src/theme/recipes/alert.ts
  ------------------------------------------------------------------------------------------------

  ```tsx
import { Alert } from "@chakra-ui/react"

export const AlertBasic = () => {
  return (
    <Alert.Root status="info" title="This is the alert title">
      <Alert.Indicator />
      <Alert.Title>This is the alert title</Alert.Title>
    </Alert.Root>
  )
}

```

## Usage

```jsx
import { Alert } from "@chakra-ui/react"
```

```jsx
<Alert.Root>
  <Alert.Indicator />
  <Alert.Content>
    <Alert.Title />
    <Alert.Description />
  </Alert.Content>
</Alert.Root>
```

:::info

If you prefer a closed component composition, check out the
[snippet below](#closed-component).

:::

## Examples

### Description

Render the `Alert.Description` component to provide additional context to the
alert.

```tsx
import { Alert } from "@chakra-ui/react"

export const AlertWithDescription = () => {
  return (
    <Alert.Root status="error">
      <Alert.Indicator />
      <Alert.Content>
        <Alert.Title>Invalid Fields</Alert.Title>
        <Alert.Description>
          Your form has some errors. Please fix them and try again.
        </Alert.Description>
      </Alert.Content>
    </Alert.Root>
  )
}

```

### Status

Change the status of the alerts by passing the `status` prop. This affects the
color scheme and icon used. Alert supports `error`, `success`, `warning`, and
`info` statuses.

```tsx
import { Alert, Stack } from "@chakra-ui/react"

export const AlertWithStatus = () => {
  return (
    <Stack gap="4" width="full">
      <Alert.Root status="error">
        <Alert.Indicator />
        <Alert.Title>There was an error processing your request</Alert.Title>
      </Alert.Root>

      <Alert.Root status="info">
        <Alert.Indicator />
        <Alert.Title>
          Chakra is going live on August 30th. Get ready!
        </Alert.Title>
      </Alert.Root>

      <Alert.Root status="warning">
        <Alert.Indicator />
        <Alert.Title>
          Seems your account is about expire, upgrade now
        </Alert.Title>
      </Alert.Root>

      <Alert.Root status="success">
        <Alert.Indicator />
        <Alert.Title>Data uploaded to the server. Fire on!</Alert.Title>
      </Alert.Root>
    </Stack>
  )
}

```

### Variants

Use the `variant` prop to change the visual style of the alert. Values can be
either `subtle`, `solid`, `outline`

```tsx
import { Alert, Stack } from "@chakra-ui/react"

export const AlertWithVariants = () => {
  return (
    <Stack gap="4">
      <Alert.Root status="success" variant="subtle">
        <Alert.Indicator />
        <Alert.Title>Data uploaded to the server. Fire on!</Alert.Title>
      </Alert.Root>

      <Alert.Root status="success" variant="solid">
        <Alert.Indicator />
        <Alert.Title>Data uploaded to the server. Fire on!</Alert.Title>
      </Alert.Root>

      <Alert.Root status="success" variant="surface">
        <Alert.Indicator />
        <Alert.Title>Data uploaded to the server. Fire on!</Alert.Title>
      </Alert.Root>
    </Stack>
  )
}

```

### With Close Button

Here's and example of how to compose the `Alert` with a close button.

```tsx
import { Alert, CloseButton } from "@chakra-ui/react"

export const AlertWithCloseButton = () => {
  return (
    <Alert.Root>
      <Alert.Indicator />
      <Alert.Content>
        <Alert.Title>Success!</Alert.Title>
        <Alert.Description>
          Your application has been received. We will review your application
          and respond within the next 48 hours.
        </Alert.Description>
      </Alert.Content>
      <CloseButton pos="relative" top="-2" insetEnd="-2" />
    </Alert.Root>
  )
}

```

### With Spinner

Here's and example of how to compose the `Alert` with a spinner.

```tsx
import { Alert, Spinner } from "@chakra-ui/react"

export const AlertWithSpinner = () => {
  return (
    <Alert.Root
      borderStartWidth="3px"
      borderStartColor="colorPalette.600"
      title="We are loading something"
    >
      <Alert.Indicator>
        <Spinner size="sm" />
      </Alert.Indicator>
      <Alert.Title>We are loading something</Alert.Title>
    </Alert.Root>
  )
}

```

### Custom Icon

Use the `icon` prop to pass a custom icon to the alert. This will override the
default icon for the alert status.

```tsx
import { Alert } from "@chakra-ui/react"
import { LuAlarmClockPlus } from "react-icons/lu"

export const AlertWithCustomIcon = () => {
  return (
    <Alert.Root status="warning">
      <Alert.Indicator>
        <LuAlarmClockPlus />
      </Alert.Indicator>
      <Alert.Title>Submitting this form will delete your account</Alert.Title>
    </Alert.Root>
  )
}

```

### Color Palette Override

The default colorPalette is inferred from the `status` prop. To override the
color palette, pass the `colorPalette` prop.

```tsx
import { Alert } from "@chakra-ui/react"

export const AlertWithColorPaletteOverride = () => {
  return (
    <Alert.Root status="info" colorPalette="teal">
      <Alert.Indicator />
      <Alert.Title>This is an info alert but shown as teal</Alert.Title>
    </Alert.Root>
  )
}

```

### Customization

You can style the `Alert` component using style props.

```tsx
import { Alert, Link, Stack } from "@chakra-ui/react"
import { LuPercent } from "react-icons/lu"

export const AlertWithCustomization = () => {
  return (
    <Stack gap="4">
      <Alert.Root title="Success" status="success">
        <Alert.Indicator>
          <LuPercent />
        </Alert.Indicator>
        <Alert.Content color="fg">
          <Alert.Title>Black Friday Sale (20% off)</Alert.Title>
          <Alert.Description>
            Upgrade your plan to get access to the sale.
          </Alert.Description>
        </Alert.Content>
        <Link alignSelf="center" fontWeight="medium">
          Upgrade
        </Link>
      </Alert.Root>

      <Alert.Root
        size="sm"
        borderStartWidth="3px"
        borderStartColor="colorPalette.solid"
        alignItems="center"
        title="Success"
        status="success"
      >
        <LuPercent />
        <Alert.Title textStyle="sm">
          Heads up: Black Friday Sale (20% off)
        </Alert.Title>
      </Alert.Root>
    </Stack>
  )
}

```

### Closed Component

Here's how to setup the `Alert` for a closed component composition.

<ExampleCode name="alert-closed-component" />

If you want to automatically add the closed component to your project, run the
command:

```bash
npx @chakra-ui/cli snippet add alert
```

## Props

### Root

| Prop | Default | Type | Description |
| --- | --- | --- | --- |
| colorPalette | gray | `'gray' \| 'red' \| 'orange' \| 'yellow' \| 'green' \| 'teal' \| 'blue' \| 'cyan' \| 'purple' \| 'pink'` | The color palette of the component |
| status | info | `'info' \| 'warning' \| 'success' \| 'error' \| 'neutral'` | The status of the component |
| variant | subtle | `'subtle' \| 'surface' \| 'outline' \| 'solid'` | The variant of the component |
| size | md | `'sm' \| 'md' \| 'lg'` | The size of the component |
| as | undefined | `React.ElementType` | The underlying element to render. |
| asChild | undefined | `boolean` | Use the provided child element as the default rendered element, combining their props and behavior. |
| unstyled | undefined | `boolean` | Whether to remove the component's style. |
| inline | false | `'true' \| 'false'` | The inline of the component |



# components > Accordion

  URL: docs/components/accordion
  Source: https://raw.githubusercontent.com/chakra-ui/chakra-ui/refs/heads/main/apps/www/content/docs/components/accordion.mdx

  Used to show and hide sections of related content on a page

  ***

  title: Accordion
  description: Used to show and hide sections of related content on a page
  links:
 - source: https://github.com/chakra-ui/chakra-ui/tree/main/packages/react/src/components/accordion
 - storybook: https://storybook.chakra-ui.com/?path=/story/components-accordion--basic
 - recipe: https://github.com/chakra-ui/chakra-ui/tree/main/packages/react/src/theme/recipes/accordion.ts
 - ark: https://ark-ui.com/react/docs/components/accordion
  ------------------------------------------------------------------------------------------------

  ```tsx
import { Accordion, Span } from "@chakra-ui/react"

export const AccordionBasic = () => {
  return (
    <Accordion.Root collapsible defaultValue={["b"]}>
      {items.map((item, index) => (
        <Accordion.Item key={index} value={item.value}>
          <Accordion.ItemTrigger>
            <Span flex="1">{item.title}</Span>
            <Accordion.ItemIndicator />
          </Accordion.ItemTrigger>
          <Accordion.ItemContent>
            <Accordion.ItemBody>{item.text}</Accordion.ItemBody>
          </Accordion.ItemContent>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  )
}

const items = [
  { value: "a", title: "First Item", text: "Some value 1..." },
  { value: "b", title: "Second Item", text: "Some value 2..." },
  { value: "c", title: "Third Item", text: "Some value 3..." },
]

```

## Usage

```tsx
import { Accordion } from "@chakra-ui/react"
```

```tsx
<Accordion.Root>
  <Accordion.Item>
    <Accordion.ItemTrigger>
      <Accordion.ItemIndicator />
    </Accordion.ItemTrigger>
    <Accordion.ItemContent>
      <Accordion.ItemBody />
    </Accordion.ItemContent>
  </Accordion.Item>
</Accordion.Root>
```

## Examples

### Controlled

Set the accordion that shows up by default.

```tsx
"use client"

import { Accordion, Span, Stack, Text } from "@chakra-ui/react"
import { useState } from "react"

export const AccordionControlled = () => {
  const [value, setValue] = useState(["second-item"])
  return (
    <Stack gap="4">
      <Text fontWeight="medium">Expanded: {value.join(", ")}</Text>
      <Accordion.Root value={value} onValueChange={(e) => setValue(e.value)}>
        {items.map((item, index) => (
          <Accordion.Item key={index} value={item.value}>
            <Accordion.ItemTrigger>
              <Span flex="1">{item.title}</Span>
              <Accordion.ItemIndicator />
            </Accordion.ItemTrigger>
            <Accordion.ItemContent>
              <Accordion.ItemBody>{item.text}</Accordion.ItemBody>
            </Accordion.ItemContent>
          </Accordion.Item>
        ))}
      </Accordion.Root>
    </Stack>
  )
}

const items = [
  { value: "first-item", title: "First Item", text: "Some value 1..." },
  { value: "second-item", title: "Second Item", text: "Some value 2..." },
  { value: "third-item", title: "Third Item", text: "Some value 3..." },
]

```

### With Icon

Here's an example of rendering a custom icon in each accordion item.

```tsx
import { Accordion, Heading, Icon, Stack } from "@chakra-ui/react"
import { LuChartBarStacked, LuTags } from "react-icons/lu"

export const AccordionWithIcon = () => {
  return (
    <Stack width="full" maxW="400px">
      <Heading size="md">Product details</Heading>
      <Accordion.Root collapsible defaultValue={["info"]}>
        {items.map((item) => (
          <Accordion.Item key={item.value} value={item.value}>
            <Accordion.ItemTrigger>
              <Icon fontSize="lg" color="fg.subtle">
                {item.icon}
              </Icon>
              {item.title}
            </Accordion.ItemTrigger>
            <Accordion.ItemContent>
              <Accordion.ItemBody>{item.content}</Accordion.ItemBody>
            </Accordion.ItemContent>
          </Accordion.Item>
        ))}
      </Accordion.Root>
    </Stack>
  )
}

const items = [
  {
    value: "info",
    icon: <LuTags />,
    title: "Product Info",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur nec odio vel dui euismod fermentum.",
  },
  {
    value: "stats",
    icon: <LuChartBarStacked />,
    title: "Stats",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur nec odio vel dui euismod fermentum.",
  },
]

```

### Expand Multiple Items

Use the `multiple` prop to allow multiple items to be expanded at once.

```tsx
import { Accordion, Span } from "@chakra-ui/react"

export const AccordionWithMultiple = () => {
  return (
    <Accordion.Root multiple defaultValue={["b"]}>
      {items.map((item, index) => (
        <Accordion.Item key={index} value={item.value}>
          <Accordion.ItemTrigger>
            <Span flex="1">{item.title}</Span>
            <Accordion.ItemIndicator />
          </Accordion.ItemTrigger>
          <Accordion.ItemContent>
            <Accordion.ItemBody>{item.text}</Accordion.ItemBody>
          </Accordion.ItemContent>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  )
}

const items = [
  { value: "a", title: "First Item", text: "Some value 1..." },
  { value: "b", title: "Second Item", text: "Some value 2..." },
  { value: "c", title: "Third Item", text: "Some value 3..." },
]

```

### Sizes

Use the `size` prop to change the size of the accordion.

```tsx
import { Accordion, For, Span, Stack, Text } from "@chakra-ui/react"

export const AccordionSizes = () => {
  return (
    <Stack gap="8">
      <For each={["sm", "md", "lg"]}>
        {(size) => (
          <Stack gap="2" key={size}>
            <Text fontWeight="semibold">{size}</Text>
            <Accordion.Root size={size} collapsible defaultValue={["b"]}>
              {items.map((item, index) => (
                <Accordion.Item key={index} value={item.value}>
                  <Accordion.ItemTrigger>
                    <Span flex="1">{item.title}</Span>
                    <Accordion.ItemIndicator />
                  </Accordion.ItemTrigger>
                  <Accordion.ItemContent>
                    <Accordion.ItemBody>{item.text}</Accordion.ItemBody>
                  </Accordion.ItemContent>
                </Accordion.Item>
              ))}
            </Accordion.Root>
          </Stack>
        )}
      </For>
    </Stack>
  )
}

const items = [
  { value: "a", title: "First Item", text: "Some value 1..." },
  { value: "b", title: "Second Item", text: "Some value 2..." },
  { value: "c", title: "Third Item", text: "Some value 3..." },
]

```

### Variants

Use the `variant` prop to change the visual style of the accordion. Values can
be either `outline`, `subtle`, `enclosed` or `plain`.

```tsx
import { Accordion, For, Span, Stack, Text } from "@chakra-ui/react"

export const AccordionVariants = () => {
  return (
    <Stack gap="8">
      <For each={["outline", "subtle", "enclosed", "plain"]}>
        {(variant) => (
          <Stack gap="2" key={variant}>
            <Text fontWeight="semibold">{variant}</Text>
            <Accordion.Root variant={variant} collapsible defaultValue={["b"]}>
              {items.map((item, index) => (
                <Accordion.Item key={index} value={item.value}>
                  <Accordion.ItemTrigger>
                    <Span flex="1">{item.title}</Span>
                    <Accordion.ItemIndicator />
                  </Accordion.ItemTrigger>
                  <Accordion.ItemContent>
                    <Accordion.ItemBody>{item.text}</Accordion.ItemBody>
                  </Accordion.ItemContent>
                </Accordion.Item>
              ))}
            </Accordion.Root>
          </Stack>
        )}
      </For>
    </Stack>
  )
}

const items = [
  { value: "a", title: "First Item", text: "Some value 1..." },
  { value: "b", title: "Second Item", text: "Some value 2..." },
  { value: "c", title: "Third Item", text: "Some value 3..." },
]

```

### Disabled Item

Pass the `disabled` prop to any `Accordion.Item` to prevent it from being
expanded or collapsed.

```tsx
import { Accordion, Span } from "@chakra-ui/react"

export const AccordionWithDisabledItem = () => {
  return (
    <Accordion.Root collapsible defaultValue={["b"]}>
      {items.map((item, index) => (
        <Accordion.Item key={index} value={item.value} disabled={item.disabled}>
          <Accordion.ItemTrigger>
            <Span flex="1">{item.title}</Span>
            <Accordion.ItemIndicator />
          </Accordion.ItemTrigger>
          <Accordion.ItemContent>
            <Accordion.ItemBody>{item.text}</Accordion.ItemBody>
          </Accordion.ItemContent>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  )
}

const items = [
  { value: "a", title: "First Item", text: "Some value 1..." },
  { value: "b", title: "Second Item", text: "Some value 2..." },
  { value: "c", title: "Third Item", text: "Some value 3...", disabled: true },
]

```

### With Avatar

Here's an example of composing an accordion with an avatar.

```tsx
import { Accordion, Avatar, Badge, HStack } from "@chakra-ui/react"
import { LuTrophy } from "react-icons/lu"
import { LoremIpsum } from "react-lorem-ipsum"

export const AccordionWithAvatar = () => {
  return (
    <Accordion.Root collapsible defaultValue={["b"]}>
      {items.map((item, index) => (
        <Accordion.Item key={index} value={item.name}>
          <Accordion.ItemTrigger>
            <Avatar.Root shape="rounded">
              <Avatar.Image src={item.image} />
              <Avatar.Fallback name={item.name} />
            </Avatar.Root>
            <HStack flex="1">
              {item.name}{" "}
              {item.topRated && (
                <Badge colorPalette="green">
                  <LuTrophy />
                  Top Rated
                </Badge>
              )}
            </HStack>
            <Accordion.ItemIndicator />
          </Accordion.ItemTrigger>
          <Accordion.ItemContent>
            <Accordion.ItemBody>{item.bio}</Accordion.ItemBody>
          </Accordion.ItemContent>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  )
}

const items = [
  {
    name: "Alex",
    bio: <LoremIpsum />,
    image: "https://i.pravatar.cc/150?u=a",
    topRated: false,
  },
  {
    name: "Benji",
    bio: <LoremIpsum />,
    image: "https://i.pravatar.cc/150?u=b",
    topRated: true,
  },
  {
    name: "Charlie",
    bio: <LoremIpsum />,
    image: "https://i.pravatar.cc/150?u=c",
    topRated: false,
  },
]

```

### With Subtext

Here's an example of adding a subtext to an accordion item.

```tsx
import { Accordion, Stack, Text } from "@chakra-ui/react"
import { LoremIpsum } from "react-lorem-ipsum"

const items = [
  { value: "a", title: "First Item", text: <LoremIpsum p={1} /> },
  { value: "b", title: "Second Item", text: <LoremIpsum p={1} /> },
  { value: "c", title: "Third Item", text: <LoremIpsum p={1} /> },
]

export const AccordionWithSubtext = () => {
  return (
    <Accordion.Root collapsible>
      {items.map((item, index) => (
        <Accordion.Item key={index} value={item.value}>
          <Accordion.ItemTrigger>
            <Stack gap="1">
              <Text>{item.title}</Text>
              <Text fontSize="sm" color="fg.muted">
                Click to expand
              </Text>
            </Stack>
          </Accordion.ItemTrigger>
          <Accordion.ItemContent>
            <Accordion.ItemBody>{item.text}</Accordion.ItemBody>
          </Accordion.ItemContent>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  )
}

```

### With Actions

Here's an example of adding actions to an accordion item trigger.

```tsx
import { AbsoluteCenter, Accordion, Box, Button, Span } from "@chakra-ui/react"
import LoremIpsum from "react-lorem-ipsum"

export const AccordionWithActions = () => {
  return (
    <Accordion.Root spaceY="4" variant="plain" collapsible defaultValue={["b"]}>
      {items.map((item, index) => (
        <Accordion.Item key={index} value={item.value}>
          <Box position="relative">
            <Accordion.ItemTrigger>
              <Span flex="1">{item.title}</Span>
              <Accordion.ItemIndicator />
            </Accordion.ItemTrigger>
            <AbsoluteCenter axis="vertical" insetEnd="0">
              <Button variant="subtle" colorPalette="blue">
                Action
              </Button>
            </AbsoluteCenter>
          </Box>
          <Accordion.ItemContent>
            <Accordion.ItemBody>{item.text}</Accordion.ItemBody>
          </Accordion.ItemContent>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  )
}

const items = [
  { value: "a", title: "First Item", text: <LoremIpsum /> },
  { value: "b", title: "Second Item", text: <LoremIpsum /> },
  { value: "c", title: "Third Item", text: <LoremIpsum /> },
]

```

## Props

### Root

| Prop | Default | Type | Description |
| --- | --- | --- | --- |
| collapsible | false | `boolean` | Whether an accordion item can be closed after it has been expanded. |
| lazyMount | false | `boolean` | Whether to enable lazy mounting |
| multiple | false | `boolean` | Whether multiple accordion items can be expanded at the same time. |
| orientation | "vertical" | `'horizontal' \| 'vertical'` | The orientation of the accordion items. |
| unmountOnExit | false | `boolean` | Whether to unmount on exit. |
| colorPalette | gray | `'gray' \| 'red' \| 'orange' \| 'yellow' \| 'green' \| 'teal' \| 'blue' \| 'cyan' \| 'purple' \| 'pink'` | The color palette of the component |
| variant | outline | `'outline' \| 'subtle' \| 'enclosed' \| 'plain'` | The variant of the component |
| size | md | `'sm' \| 'md' \| 'lg'` | The size of the component |
| as | undefined | `React.ElementType` | The underlying element to render. |
| asChild | undefined | `boolean` | Use the provided child element as the default rendered element, combining their props and behavior. |
| unstyled | undefined | `boolean` | Whether to remove the component's style. |
| defaultValue | undefined | `string[]` | The initial value of the expanded accordion items.
Use when you don't need to control the value of the accordion. |
| disabled | undefined | `boolean` | Whether the accordion items are disabled |
| id | undefined | `string` | The unique identifier of the machine. |
| ids | undefined | `Partial<{\n  root: string\n  item: (value: string) => string\n  itemContent: (value: string) => string\n  itemTrigger: (value: string) => string\n}>` | The ids of the elements in the accordion. Useful for composition. |
| onFocusChange | undefined | `(details: FocusChangeDetails) => void` | The callback fired when the focused accordion item changes. |
| onValueChange | undefined | `(details: ValueChangeDetails) => void` | The callback fired when the state of expanded/collapsed accordion items changes. |
| value | undefined | `string[]` | The controlled value of the expanded accordion items. |


### Item

| Prop | Default | Type | Description |
| --- | --- | --- | --- |
| value | undefined | `string` | The value of the accordion item. |
| as | undefined | `React.ElementType` | The underlying element to render. |
| asChild | undefined | `boolean` | Use the provided child element as the default rendered element, combining their props and behavior. |
| disabled | undefined | `boolean` | Whether the accordion item is disabled. |
