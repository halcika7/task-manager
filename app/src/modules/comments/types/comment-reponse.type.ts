import type { Comment } from '@/modules/comments/types/comment.type';
import type { ManyResponse } from '@/shared/types/many-reponse.type';

export type CommentResponse = ManyResponse<Comment>;
