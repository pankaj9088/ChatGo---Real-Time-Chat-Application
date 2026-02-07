# Video Calling - Console Testing Guide

## 🔍 Current Issues Being Debugged

### Issue 1: Caller stuck on "Calling..." status
**Expected**: Should change to "Connected" when receiver accepts
**Current**: Stays on "Calling..." even after connection

### Issue 2: Receiver shows "Unknown" instead of caller name
**Expected**: Should show caller's actual name
**Current**: Shows "Unknown"

## 📝 Testing Steps with Console Logs

### Step 1: Open Two Browsers
1. **Browser 1** (Chrome): Will be the CALLER
2. **Browser 2** (Firefox or Chrome Incognito): Will be the RECEIVER

### Step 2: Open Console in BOTH Browsers
- Press **F12**
- Click on **Console** tab
- Clear console (click 🚫 icon)

### Step 3: Login to Both Browsers
- Browser 1: Login as User A (e.g., "Pankaj Kumar Sah")
- Browser 2: Login as User B (e.g., "Test User")

### Step 4: Start Call from Browser 1 (CALLER)

**Expected Console Logs in Browser 1:**
```
Starting call to: <userId> {name: "Test User", ...}
Local stream obtained: MediaStream {...}
Sending call initiate to: <userId>
Connection state: connecting
ICE candidate received: {...}
```

**What to check:**
- ✅ "Starting call to" shows correct user ID and data
- ✅ "Local stream obtained" appears (camera permission granted)
- ✅ ICE candidates are being received

### Step 5: Check Browser 2 (RECEIVER)

**Expected Console Logs in Browser 2:**
```
Incoming call from: <callerId>
Caller data fetched: {name: "Pankaj Kumar Sah", _id: "...", ...}
```

**What to check:**
- ✅ "Incoming call from" shows caller's user ID
- ✅ "Caller data fetched" shows complete caller information
- ❌ If you see "Error fetching caller data" - API call failed
- ✅ Incoming call modal should appear with caller's photo and name

### Step 6: Accept Call in Browser 2

**Expected Console Logs in Browser 2:**
```
Accepting call with caller data: {name: "Pankaj Kumar Sah", ...}
Answering call from: {name: "Pankaj Kumar Sah", ...}
Local stream obtained for answer: MediaStream {...}
Sending answer to: <callerId>
Connection state: connecting
Connection state: connected
Remote track received: MediaStream {...}
```

**What to check:**
- ✅ "Accepting call with caller data" shows caller info
- ✅ "Local stream obtained for answer" appears
- ✅ "Sending answer to" shows correct caller ID
- ✅ "Connection state: connected" appears
- ✅ "Remote track received" appears

### Step 7: Check Browser 1 Again (CALLER)

**Expected Console Logs in Browser 1:**
```
Call answered event received
Remote description set, updating status to CONNECTED
Connection state: connected
Remote track received: MediaStream {...}
```

**What to check:**
- ✅ "Call answered event received" - This is CRITICAL!
- ✅ "Remote description set, updating status to CONNECTED"
- ✅ "Connection state: connected"
- ✅ "Remote track received"

## 🐛 Common Issues & Solutions

### Issue: "Call answered event received" NOT appearing in Browser 1
**Problem**: Socket event not reaching caller
**Solutions**:
1. Check backend console for socket errors
2. Verify both users are connected to socket
3. Check if `call:answer` event is being emitted from receiver

### Issue: "Error fetching caller data" in Browser 2
**Problem**: API call to get user info failed
**Solutions**:
1. Check if backend is running (http://localhost:5000)
2. Check if user ID is valid
3. Check if token is valid in localStorage
4. Check backend console for errors

### Issue: "Remote track received" NOT appearing
**Problem**: WebRTC peer connection not established
**Solutions**:
1. Check if ICE candidates are being exchanged
2. Check firewall settings
3. Try on same WiFi network
4. Check if both cameras are working

### Issue: Black screen even with "Remote track received"
**Problem**: Video element not displaying stream
**Solutions**:
1. Check if video element has srcObject set
2. Check if autoPlay is enabled
3. Check browser console for video playback errors

## 🔧 Quick Debug Commands

Run these in browser console:

### Check if socket is connected:
```javascript
console.log('Socket connected:', window.socket?.connected);
```

### Check local stream:
```javascript
const localVideo = document.querySelector('video[muted]');
console.log('Local stream:', localVideo?.srcObject);
console.log('Local tracks:', localVideo?.srcObject?.getTracks());
```

### Check remote stream:
```javascript
const remoteVideo = document.querySelector('video:not([muted])');
console.log('Remote stream:', remoteVideo?.srcObject);
console.log('Remote tracks:', remoteVideo?.srcObject?.getTracks());
```

### Check peer connection:
```javascript
// This won't work directly, but check console logs for connection state
```

## 📊 Expected Final State

### Browser 1 (CALLER):
- Status: "Connected"
- Local video: Your camera (small, bottom-right)
- Remote video: Receiver's camera (full screen)
- Name: Receiver's actual name

### Browser 2 (RECEIVER):
- Status: "Connected"
- Local video: Your camera (small, bottom-right)
- Remote video: Caller's camera (full screen)
- Name: Caller's actual name

## 📸 What to Share for Debugging

If still not working, share:
1. **Console logs from BOTH browsers** (copy all text)
2. **Screenshot of both screens**
3. **Backend console logs** (if any errors)
4. **Network tab** - check if API calls are succeeding

## 🎯 Next Steps

After testing, report:
- ✅ Which console logs appeared
- ❌ Which console logs did NOT appear
- 📸 Screenshots of both browsers
- 🔴 Any red errors in console

This will help identify exactly where the issue is!
