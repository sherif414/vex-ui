<script setup lang="ts">
import { Avatar } from '@/components'

const src = 'avatars/01.png'
</script>

<template>
  <Avatar :src="src" #="{ loadStatus }" class="vex-avatar --size-md --ring-danger --rounded-full">
    <!-- error -->

    <span v-if="loadStatus === 'error'" class="vex-avatar-error">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <path
          fill="currentColor"
          d="M5 21q-.825 0-1.413-.588T3 19v-6.6l3 3l4-4l4 4l4-4l3 3V19q0 .825-.588 1.413T19 21H5ZM5 3h14q.825 0 1.413.588T21 5v6.575l-3-3l-4 4l-4-4l-4 4l-3-3V5q0-.825.588-1.413T5 3Z"
        />
      </svg>
    </span>

    <!-- fallback -->

    <span v-else class="vex-avatar-fallback"> AJ </span>
  </Avatar>
</template>

<style lang="scss">
.vex-avatar {
  flex: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  user-select: none;
  vertical-align: middle;
}

//------ fallback ------//

.vex-avatar-fallback {
  width: 100%;
  height: 100%;
  border-radius: inherit;
  background-color: var(--vex-c-accent-100);
  color: var(--vex-c-accent-500);
  display: flex;
  align-items: center;
  justify-content: center;
}

//------ img ------//

.vex-avatar > img {
  width: 100%;
  height: 100%;
  border-radius: inherit;
  object-position: center;
  object-fit: cover;
  aspect-ratio: 1/1;
}

//------ error ------//

.vex-avatar-error {
  width: 100%;
  height: 100%;
  border-radius: inherit;
  background-color: var(--vex-c-danger-100);
  color: var(--vex-c-danger-500);
  display: inline-flex;
  align-items: center;
  justify-content: center;

  & > svg {
    width: 50%;
    height: 50%;
  }
}

//------ size ------//

.vex-avatar.--size-sm {
  height: 2rem;
  width: 2rem;
}
.vex-avatar.--size-md {
  height: 3rem;
  width: 3rem;
}
.vex-avatar.--size-lg {
  height: 4rem;
  width: 4rem;
}

//------ ring ------//

.vex-avatar.--ring-black {
  border: 2px solid black;
}
.vex-avatar.--ring-white {
  border: 2px solid white;
}
.vex-avatar.--ring-accent {
  border: 2px solid var(--vex-c-accent-500);
}
.vex-avatar.--ring-primary {
  border: 2px solid var(--vex-c-primary-500);
}
.vex-avatar.--ring-danger {
  border: 2px solid var(--vex-c-danger-500);
}
.vex-avatar.--ring-warning {
  border: 2px solid var(--vex-c-warning-500);
}
.vex-avatar.--ring-success {
  border: 2px solid var(--vex-c-success-500);
}

//------ border radius ------//

.vex-avatar.--rounded-sm {
  border-radius: var(--vex-border-radius-sm);
}
.vex-avatar.--rounded-md {
  border-radius: var(--vex-border-radius-md);
}
.vex-avatar.--rounded-lg {
  border-radius: var(--vex-border-radius-lg);
}
.vex-avatar.--rounded-none {
  border-radius: var(--vex-border-radius-none);
}
.vex-avatar.--rounded-full {
  border-radius: var(--vex-border-radius-full);
}
</style>
