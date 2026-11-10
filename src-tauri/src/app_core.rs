use serde_json::{json, Value};

/// Runtime metadata exposed to the Svelte shell.
/// Product behavior belongs in Rust commands; Svelte should only render state
/// and forward user intents to these commands.
pub const APP_NAME: &str = "MAX++";
pub const APP_VERSION: &str = env!("CARGO_PKG_VERSION");

#[tauri::command]
pub fn app_core_info() -> Value {
    json!({
        "name": APP_NAME,
        "version": APP_VERSION,
        "runtime": "rust",
        "bridge": "tauri-v2",
        "business_logic": "native"
    })
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn core_metadata_is_stable() {
        assert_eq!(APP_NAME, "MAX++");
        assert!(!APP_VERSION.is_empty());
    }
}
