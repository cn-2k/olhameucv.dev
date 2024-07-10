<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { cn } from "@/helpers/utils";

interface SkeletonProps {
  class?: HTMLAttributes["class"];
}

const props = defineProps<SkeletonProps>();
</script>

<template>
  <div
    :class="
      cn('animate-pulse rounded-md bg-zinc-100 dark:bg-zinc-800', props.class)
    "
  />
</template>
~/helpers/utils
