<script lang="ts">
  import { onMount } from 'svelte';

  export let status: string = '';
  export let notificationPermission: NotificationPermission = 'default';
  export let insideGeofences: string[] = [];
  export let outsideGeofences: string[] = [];

  async function requestNotificationPermission() {
    try {
      const permission = await Notification.requestPermission();
      notificationPermission = permission;
    } catch (error) {
      console.error('Error requesting notification permission:', error);
    }
  }

  onMount(() => {
    notificationPermission = Notification.permission;
  });
</script>

<div class="fixed bottom-4 right-4 space-y-2 z-50">
  {#if status}
    <div class="bg-blue-500 text-white p-4 rounded-lg shadow-lg">
      {status}
    </div>
  {/if}

  {#if notificationPermission === 'default'}
    <button
      on:click={requestNotificationPermission}
      class="bg-yellow-500 hover:bg-yellow-600 text-white p-4 rounded-lg shadow-lg transition-colors"
    >
      Enable Notifications
    </button>
  {:else if notificationPermission === 'denied'}
    <div class="bg-red-500 text-white p-4 rounded-lg shadow-lg">
      Notifications are blocked. Please enable them in your browser settings.
    </div>
  {/if}

  {#if insideGeofences.length > 0}
    <div class="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded shadow-lg">
      <p class="font-bold">Inside Geofences:</p>
      <ul class="list-disc list-inside">
        {#each insideGeofences as geofence}
          <li>{geofence}</li>
        {/each}
      </ul>
    </div>
  {/if}
  
  {#if outsideGeofences.length > 0}
    <div class="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 rounded shadow-lg">
      <p class="font-bold">Outside Geofences:</p>
      <ul class="list-disc list-inside">
        {#each outsideGeofences as geofence}
          <li>{geofence}</li>
        {/each}
      </ul>
    </div>
  {/if}
</div>

<style>
  div {
    max-width: 300px;
  }
</style>
