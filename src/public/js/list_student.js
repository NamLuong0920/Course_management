async function showListStudent(value)
{
    window.location.href = `/list_student?course_id=${encodeURIComponent(value)}`;
}