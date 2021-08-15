import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import {getComments} from '../actions/writingActions';
import CommentResponseInput from './CommentResponseInput';
import CommentThread from './CommentThread';

const CommentSection = ({
    writing,
    hasComments,
    getComments,
    gettingCommentsLoading,
    trigger,
}) => {

    useEffect(() => {
        getComments(writing.id);
    }, []);

    return (
        <div>
            {
                !hasComments &&
                    <p style={{fontFamily: 'Public Sans'}}>¡No hay comentarios todavía! Sé el primero en añadir uno.</p>
            }
            {
                hasComments &&
                    <CommentThread
                        comments={writing.comments}
                        loading={gettingCommentsLoading}
                        depth={0}
                        writingId={writing.id}
                        parents={[]}
                    />
            }
            <CommentResponseInput
                writingId={writing.id}
                commentId={null}
                depth={0}
                trigger={trigger}
            />
        </div>
    );
}

const mapStateToProps = (state) => ({
    gettingCommentsLoading: state.writing.gettingCommentsLoading,
});

export default connect(mapStateToProps, {getComments})(CommentSection);