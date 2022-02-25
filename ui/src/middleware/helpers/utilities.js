/**
 * Send a toast notification to the client.
 *
 * @param {String} context The context of the scope.
 * @param {String} message The message to show.
 * @param {String} type The type of toast. E.g. Success, error.
 * @param {Boolean} showClose True if user should be able to manually close the toast.
 */
export const notify = (context, message, type, showClose = true) =>
    context.$notify({
        message: message,
        type: type,
        top: true,
        right: true,
        showClose: showClose,
    });
