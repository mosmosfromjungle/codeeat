import { Request, Response } from 'express'
import Friends, { IFriendsDocument } from '../../models/Friends'
import FriendRequest, { IFriendRequestDocument } from '../../models/FriendRequest'
import User from '../../models/User'

interface CustomRequest extends Request {
  decoded?: any
}

// TODO: access token에서 decode한 정보 포함해서 인증하도록 수정해야함

/* 친구 요청 */
export const sendFriendRequest = async (req: Request, res: Response) => {
  const { requester, recipient } = req.body

  // const foundRequester = await User.findOne({ username: requester })
  // if (!foundRequester) return res.status(409).json({ message: 'Requester not found' })
  // const foundRecipient = await User.findOne({ username: recipient })
  // if (!foundRecipient) return res.status(410).json({ message: 'Recipient not found' })

  const existingFriendship = await Friends.findOne({
    $or: [
      { 'requester.username': requester, 'recipient.username': recipient },
      { 'requester.username': recipient, 'recipient.username': requester },
    ],
  })
  if (existingFriendship) return res.status(401).json({ message: '이미 친구에요!' })

  try {
    const existingRequest = await FriendRequest.findOne({
      'requester.username': requester,
      'recipient.username': recipient,
    })
    if (existingRequest) {
      return res.status(400).json({ message: '이미 친구요청을 보냈어요!' })
    }

    const foundRequester = await User.findOne({ username: requester })
    if (!foundRequester) return res.status(409).json({ message: 'Requester not found' })
    const foundRecipient = await User.findOne({ username: recipient })
    if (!foundRecipient) return res.status(410).json({ message: '친구를 찾을 수 없어요!' })

    const newRequest: IFriendRequestDocument = new FriendRequest({
      requester: {
        username: requester,
        userObj: foundRequester._id,
      },
      recipient: {
        username: recipient,
        userObj: foundRecipient._id,
      },
      createdAt: new Date(),
    })

    await newRequest.save()

    if (newRequest) {
      return res.status(201).json({
        status: 201,
        message: '친구 요청 완료',
        payload: newRequest,
      })
    }
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: '친구 요청을 실패했어요ㅠㅠ' })
  }
}

/* 친구 요청 취소 */
export const cancelFriendRequest = async (req: Request, res: Response) => {
  const { requester, recipient } = req.body

  const foundRequester = await User.findOne({ userId: requester })
  const foundRecipient = await User.findOne({ userId: recipient })
  if (!foundRequester || !foundRecipient) {
    return res.status(409).json({ message: 'Requester or recipient not found' })
  }

  try {
    const request = await FriendRequest.findOneAndDelete({
      requesterId: foundRequester.userId,
      recipientId: foundRecipient.userId,
    })

    if (!request) {
      return res.status(404).json({ message: 'Friend request not found' })
    }

    res.status(200).json({ message: 'Friend request cancelled successfully' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Failed to cancel friend request' })
  }
}

/* 친구 요청 수락 */
export const acceptFriendRequest = async (req: Request, res: Response) => {
  const { requester, recipient } = req.body

  const foundRequester = await User.findOne({ username: requester })
  const foundRecipient = await User.findOne({ username: recipient })
  if (!foundRequester || !foundRecipient)
    return res.status(409).json({ message: 'Recipient or recipient not found' })

  const existingFriendship = await Friends.findOne({
    $or: [
      { 'requester.username': requester, 'recipient.username': recipient },
      { 'requester.username': recipient, 'recipient.username': requester },
    ],
  })
  if (existingFriendship) return res.status(410).json({ message: 'Already friends ' })

  try {
    const request = await FriendRequest.findOne({
      'requester.username': foundRequester.username,
      'recipient.username': foundRecipient.username,
    })
    if (!request) {
      return res.status(404).json({ message: 'Friend request not found' })
    }

    const newFriendship: IFriendsDocument = new Friends({
      requester: {
        username: requester,
        userObj: foundRequester._id,
      },
      recipient: {
        username: recipient,
        userObj: foundRecipient._id,
      },
      createdAt: new Date(),
    })

    await newFriendship.save()
    await FriendRequest.deleteOne({
      'requester.username': foundRequester.username,
      'recipient.username': foundRecipient.username,
    })

    res.status(200).json({ message: 'Friend request accepted' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Failed to accept friend request' })
  }
}

/* 친구 요청 거절 */
export const rejectFriendRequest = async (req: Request, res: Response) => {
  const { requester, recipient } = req.body

  const foundRequester = await User.findOne({ username: requester })
  const foundRecipient = await User.findOne({ username: recipient })
  if (!foundRequester || !foundRecipient)
    return res.status(409).json({ message: 'Recipient or recipient not found' })

  const existingFriendship = await Friends.findOne({
    $or: [
      { 'requester.username': requester, 'recipient.username': recipient },
      { 'requester.username': recipient, 'recipient.username': requester },
    ],
  })
  if (existingFriendship) return res.status(410).json({ message: 'Already friends ' })

  try {
    const request = await FriendRequest.findOne({
      'requester.username': foundRequester.username,
      'recipient.username': foundRecipient.username,
    })
    if (!request) {
      return res.status(404).json({ message: 'Friend request not found' })
    }

    await FriendRequest.deleteOne({
      'requester.username': foundRequester.username,
      'recipient.username': foundRecipient.username,
    })
    res.status(200).json({ message: 'Friend request rejected' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Failed to reject friend request' })
  }
}

/* 친구 목록 조회 */
export const getFriendsList = async (req: CustomRequest, res: Response) => {
  const decoded = req.decoded

  const foundUser = await User.collection.findOne({ userId: decoded.userId })
  if (!foundUser) return res.status(409).json({ message: 'User not found' })

  try {
    const friendsList = await Friends.find({
      $or: [
        { 'requester.username': foundUser.username },
        { 'recipient.username': foundUser.username },
      ],
    })
      .populate('requester.userObj')
      .populate('recipient.userObj')

    // Then, map the result to create a new list which contains the details of the other player
    const friendsListForDisplay = friendsList.map((friend) => {
      if (friend.requester!.username === foundUser.username) {
        return {
          username: friend.recipient!.userObj.username,
          character: friend.recipient!.userObj.userProfile.character,
        }
      } else {
        return {
          username: friend.requester!.userObj.username,
          character: friend.requester!.userObj.userProfile.character,
        }
      }
    })

    res.status(200).json({ friendsListForDisplay })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Failed to get friends list' })
  }
}

/* 보낸 + 받은 친구 요청 목록 조회 */
export const getFriendRequests = async (req: CustomRequest, res: Response) => {
  const decoded = req.decoded

  const foundUser = await User.collection.findOne({ userId: decoded.userId })

  if (!foundUser) {
    return res.status(409).json({ message: 'User not found' })
  }

  try {
    const sentRequests = await FriendRequest.find({
      'requester.username': foundUser.username,
    }).populate('requester.userObj')
    const receivedRequests = await FriendRequest.find({
      'recipient.username': foundUser.username,
    }).populate('requester.userObj')
    // const findSentRequests = receivedRequests.map((request) => ({
    //   username: request.recipient!.userObj.username,
    //   character: request.recipient!.userObj.userProfile.character,
    // }))
    const findReceivedRequests = receivedRequests.map((request) => ({
      username: request.requester!.userObj.username,
      character: request.requester!.userObj.userProfile.character,
    }))

    res.status(200).json({ findReceivedRequests })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Failed to get friend requests' })
  }
}

/* 친구 삭제 */
export const removeFriend = async (req: Request, res: Response) => {
  const { requester, recipient } = req.body

  const foundRequester = await User.findOne({ username: requester })
  const foundRecipient = await User.findOne({ username: recipient })
  if (!foundRequester || !foundRecipient) {
    return res.status(409).json({ message: 'Requester or recipient not found' })
  }

  try {
    const existingFriendship = await Friends.findOne({
      $or: [
        { 'requester.username': requester, 'recipient.username': recipient },
        { 'requester.username': recipient, 'recipient.username': requester },
        { requesterId: foundRequester.userId, recipientId: foundRecipient.userId },
        { requesterId: foundRecipient.userId, recipientId: foundRequester.userId },
      ],
    })

    if (!existingFriendship) {
      return res.status(404).json({ message: 'Friendship not found' })
    }

    await existingFriendship.deleteOne()
    res.status(200).json({ message: 'Friend removed successfully' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Failed to remove friend' })
  }
}
