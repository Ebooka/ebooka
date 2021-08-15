import React from 'react';
import {Spinner} from 'reactstrap';
import Comment from './Comment';

const CommentThread = ({
    comments,
    loading,
    depth,
    writingId,
    parents,
}) => {

    return (
        <div>
            {
                loading &&
                    <Spinner size={'sm'} color={'dark'}>{''}</Spinner>
            }
            {
                !loading &&
                    <div>
                        {
                            comments.map(comment =>
                                <Comment current={comment}
                                         key={comment.id}
                                         writingId={writingId}
                                         parents={parents}
                                         depth={depth}
                                />
                            )
                        }
                    </div>
            }
        </div>
    );
};

export default CommentThread;