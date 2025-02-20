function custom_react_widget_shortcode($atts) {
    ob_start();
    include 'path/to/your/render.php';  // Ensure this includes the necessary PHP and JavaScript
    return ob_get_clean();
}
add_shortcode('react_widget', 'custom_react_widget_shortcode');
