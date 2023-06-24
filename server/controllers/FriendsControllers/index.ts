import { Request, Response } from 'express';
import Friends, { IFriendsDocument } from '../../models/Friends'
import FriendRequest, { IFriendRequestDocument } from '../../models/FriendRequest';
import User from '../../models/User';

interface CustomRequest extends Request {
    decoded?: any;
}

// TODO: access token에서 decode한 정보 포함해서 인증하도록 수정해야함 

/* 친구 요청 */
export const sendFriendRequest = async (req: Request, res: Response) => {
    const { requester, recipient } = req.body;

    const foundRequester = await User.findOne({ userId: requester })
    if (!foundRequester) return res.status(409).json({ message: 'Requester not found' })
    const foundRecipient = await User.findOne({ userId: recipient })
    if (!foundRecipient) return res.status(410).json({ message: 'Recipient not found' })

    const existingFriendship = await Friends.findOne({
        $or: [
          { requesterId: foundRequester.userId, recipientId: foundRecipient.userId },
          { requesterId: foundRecipient.userId, recipientId: foundRequester.userId },
        ],
    });
    if (existingFriendship) return res.status(410).json({ message: 'Already friends '})
  
    try {
      const existingRequest = await FriendRequest.findOne({ requesterId: foundRequester.userId, recipientId: foundRecipient.userId });
      if (existingRequest) {
        return res.status(400).json({ message: 'Friend request already exists' });
      }
  
      const newRequest: IFriendRequestDocument = new FriendRequest({
        requesterId: foundRequester.userId,
        recipientId: foundRecipient.userId,
        createdAt: new Date(),
      });
  
      await newRequest.save();
      res.status(201).json({ message: 'Friend request sent successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to send friend request' });
    }
};

/* 친구 요청 취소 */
export const cancelFriendRequest = async (req: Request, res: Response) => {
    const { requester, recipient } = req.body;
  
    const foundRequester = await User.findOne({ userId: requester });
    const foundRecipient = await User.findOne({ userId: recipient });
    if (!foundRequester || !foundRecipient) {
      return res.status(409).json({ message: 'Requester or recipient not found' });
    }
  
    try {
      const request = await FriendRequest.findOneAndDelete({
        requesterId: foundRequester.userId,
        recipientId: foundRecipient.userId,
      });
  
      if (!request) {
        return res.status(404).json({ message: 'Friend request not found' });
      }
  
      res.status(200).json({ message: 'Friend request cancelled successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to cancel friend request' });
    }
};

/* 친구 요청 수락 */
export const acceptFriendRequest = async (req: Request, res: Response) => {
    const { requester, recipient } = req.body;
  
    const foundRequester = await User.findOne({ userId: requester })
    const foundRecipient = await User.findOne({ userId: recipient })
    if (!foundRequester || !foundRecipient) return res.status(409).json({ message: 'Recipient or recipient not found' })

    const existingFriendship = await Friends.findOne({
        $or: [
          { requesterId: foundRequester.userId, recipientId: foundRecipient.userId },
          { requesterId: foundRecipient.userId, recipientId: foundRequester.userId },
        ],
    });
    if (existingFriendship) return res.status(410).json({ message: 'Already friends '})
  
    try {
      const request = await FriendRequest.findOne({ requesterId: foundRequester.userId, recipientId: foundRecipient.userId });
      if (!request) {
        return res.status(404).json({ message: 'Friend request not found' });
      }
  
      const newFriendship: IFriendsDocument = new Friends({
        requesterId: foundRequester.userId,
        recipientId: foundRecipient.userId,
        createdAt: new Date(),
      });
  
      await newFriendship.save();
      await FriendRequest.deleteOne({ requesterId: foundRequester.userId, recipientId: foundRecipient.userId });
      res.status(200).json({ message: 'Friend request accepted' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to accept friend request' });
    }
  };

/* 친구 요청 거절 */
export const rejectFriendRequest = async (req: Request, res: Response) => {
    const { requester, recipient } = req.body;

    const foundRequester = await User.findOne({ userId: requester })
    const foundRecipient = await User.findOne({ userId: recipient })
    if (!foundRequester || !foundRecipient) return res.status(409).json({ message: 'Recipient or recipient not found' })

    const existingFriendship = await Friends.findOne({
        $or: [
          { requesterId: foundRequester.userId, recipientId: foundRecipient.userId },
          { requesterId: foundRecipient.userId, recipientId: foundRequester.userId },
        ],
    });
    if (existingFriendship) return res.status(410).json({ message: 'Already friends '})
  
    try {
      const request = await FriendRequest.findOne({ requesterId: foundRequester.userId, recipientId: foundRecipient.userId });
      if (!request) {
        return res.status(404).json({ message: 'Friend request not found' });
      }
  
      await FriendRequest.deleteOne({ requesterId: foundRequester.userId, recipientId: foundRecipient.userId });
      res.status(200).json({ message: 'Friend request rejected' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to reject friend request' });
    }
};

/* 친구 목록 조회 */
export const getFriendsList = async (req: CustomRequest, res: Response) => {
  const decoded = req.decoded

  const foundUser = await User.collection.findOne({ userId: decoded.userId })
  if (!foundUser) return res.status(409).json({ message: 'User not found' })

  try {
    const friendsList = await Friends.find({ $or: [{ requesterId: foundUser.userId }, { recipientId: foundUser.userId }] });
    res.status(200).json({ friends: friendsList });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to get friends list' });
  }
};

/* 보낸 + 받은 친구 요청 목록 조회 */
export const getFriendRequests = async (req: CustomRequest, res: Response) => {
    const decoded = req.decoded
  
    const foundUser = await User.collection.findOne({ userId: decoded.userId })
    if (!foundUser) {
      return res.status(409).json({ message: 'User not found' });
    }
  
    try {
      const sentRequests = await FriendRequest.find({ requesterId: foundUser.userId });
      const receivedRequests = await FriendRequest.find({ recipientId: foundUser.userId });
  
      res.status(200).json({ sentRequests, receivedRequests });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to get friend requests' });
    }
};
  

/* 친구 삭제 */
export const removeFriend = async (req: Request, res: Response) => {
    const { requester, recipient } = req.body;
  
    const foundRequester = await User.findOne({ userId: requester });
    const foundRecipient = await User.findOne({ userId: recipient });
    if (!foundRequester || !foundRecipient) {
      return res.status(409).json({ message: 'Requester or recipient not found' });
    }
  
    try {
      const existingFriendship = await Friends.findOne({
        $or: [
          { requesterId: foundRequester.userId, recipientId: foundRecipient.userId },
          { requesterId: foundRecipient.userId, recipientId: foundRequester.userId },
        ],
      });
  
      if (!existingFriendship) {
        return res.status(404).json({ message: 'Friendship not found' });
      }
  
      await existingFriendship.deleteOne();
      res.status(200).json({ message: 'Friend removed successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to remove friend' });
    }
};
