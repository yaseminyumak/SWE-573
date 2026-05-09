import { apiClient } from '../../shared/api/client'

export interface LikeStatus {
  count: number
  likedByMe: boolean
}

export interface CommentDto {
  id: string
  username: string
  body: string
  createdAt: string
}

export interface LikedEntity {
  entityType: string
  entityId: string
}

export const fetchLikeStatus = (entityType: string, entityId: string) =>
  apiClient<LikeStatus>(`/social/likes?entityType=${entityType}&entityId=${entityId}`)

export const toggleLike = (entityType: string, entityId: string) =>
  apiClient<LikeStatus>('/social/likes', {
    method: 'POST',
    body: JSON.stringify({ entityType, entityId }),
  })

export const fetchComments = (entityType: string, entityId: string) =>
  apiClient<CommentDto[]>(`/social/comments?entityType=${entityType}&entityId=${entityId}`)

export const addComment = (entityType: string, entityId: string, body: string) =>
  apiClient<CommentDto>('/social/comments', {
    method: 'POST',
    body: JSON.stringify({ entityType, entityId, body }),
  })

export const deleteComment = (commentId: string) =>
  apiClient<void>(`/social/comments/${commentId}`, { method: 'DELETE' })

export const fetchMyLikes = () =>
  apiClient<LikedEntity[]>('/social/likes/mine')

export const fetchMyComments = () =>
  apiClient<CommentDto[]>('/social/comments/mine')
